import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const ENDPOINT = "https://bawakdahel.bintangganteng123.win/webhook/multi-agent";
const SECRET = "mysecret"; // Secret key untuk HMAC

// Fungsi untuk generate HMAC SHA256 signature
async function generateSignature(body) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(body));
  const hashArray = Array.from(new Uint8Array(signature));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  return "sha256=" + hashHex;
}

/* ---------- Markdown renderer ---------- */
const MarkdownMessage = React.memo(
  function MarkdownMessage({ children }) {
    const components = useMemo(
      () => ({
        p: (props) => <p className="mb-2 whitespace-pre-wrap" {...props} />,
        strong: (props) => <strong className="font-semibold" {...props} />,
        em: (props) => <em className="italic" {...props} />,
        ul: (props) => <ul className="list-disc pl-5 space-y-1 mb-2" {...props} />,
        ol: (props) => <ol className="list-decimal pl-5 space-y-1 mb-2" {...props} />,
        li: (props) => <li className="leading-relaxed" {...props} />,
        code: ({ inline, ...props }) =>
          inline ? (
            <code className="px-1 py-0.5 rounded bg-black/10" {...props} />
          ) : (
            <code className="block whitespace-pre overflow-x-auto p-3 rounded bg-black/10" {...props} />
          ),
        a: (props) => (
          <a className="text-emerald-700 underline" target="_blank" rel="noreferrer" {...props} />
        ),
      }),
      []
    );
    return (
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {children}
      </ReactMarkdown>
    );
  },
  (prev, next) => prev.children === next.children
);

/* ---------- Bubble ---------- */
const MessageBubble = React.memo(function MessageBubble({ msg }) {
  const isUser = msg.role === "user";
  const cls = isUser
    ? "bg-emerald-600 text-white"
    : msg.isError
    ? "bg-red-50 text-red-800 ring-1 ring-red-100"
    : "bg-emerald-50 text-emerald-900 ring-1 ring-emerald-100";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm shadow ${cls}`}>
        <MarkdownMessage>{msg.content}</MarkdownMessage>
      </div>
    </div>
  );
});

/* ---------- List + autoscroll ---------- */
const MessagesList = React.memo(function MessagesList({ messages, loading }) {
  const listRef = useRef(null);
  useEffect(() => {
    listRef.current?.scrollTo(0, listRef.current.scrollHeight);
  }, [messages.length]);

  return (
    <div
      ref={listRef}
      className="h-[60vh] overflow-y-auto rounded-2xl ring-1 ring-emerald-100 bg-white p-4 space-y-3 will-change-transform"
    >
      {messages.map((m, i) => (
        <MessageBubble key={i} msg={m} />
      ))}
      {loading && <div className="text-xs text-gray-500 italic">Mengetik…</div>}
    </div>
  );
});

/* ---------- Helper parsing balasan ---------- */
function tryParseJSON(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function findFirstStringDeep(obj, depth = 0) {
  if (obj == null || depth > 4) return null;
  const candidates = ["response", "reply", "message", "data", "content", "result", "output", "text"];

  // cek field umum dulu
  for (const key of candidates) {
    if (typeof obj?.[key] === "string" && obj[key].trim()) return obj[key];
  }
  // kalau string bersarang
  for (const key of candidates) {
    if (typeof obj?.[key] === "object") {
      const str = findFirstStringDeep(obj[key], depth + 1);
      if (str) return str;
    }
  }
  // scan seluruh properti
  for (const k in obj) {
    const v = obj[k];
    if (typeof v === "string" && v.trim()) return v;
    if (typeof v === "object") {
      const str = findFirstStringDeep(v, depth + 1);
      if (str) return str;
    }
  }
  return null;
}

export default function Chatbot() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Halo! **Ada yang bisa saya bantu?**" },
  ]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    setMessages((m) => [...m, { role: "user", content: text }]);
    setInput("");
    setLoading(true);

    try {
      const ctrl = new AbortController();
      const to = setTimeout(() => ctrl.abort(), 20000); // 20s timeout

      // Kirim query sebagai text biasa
      const bodyString = text;
      
      // Generate HMAC signature
      const signature = await generateSignature(bodyString);
      
      console.debug("[chatbot] signature:", signature, "body:", bodyString);

      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
          Accept: "application/json",
          "X-Hub-Signature-256": signature, // Tambahkan signature di header
        },
        body: bodyString,
        signal: ctrl.signal,
      });
      clearTimeout(to);

      const ct = res.headers.get("content-type") || "";
      let replyStr = "";

      // 1) baca body mentah
      const raw = await res.text();
      console.debug("[chatbot] status:", res.status, "ct:", ct, "raw:", raw);

      // 2) kalau JSON, parse; kalau bukan, coba parse manual juga
      const parsed =
        ct.includes("application/json") ? tryParseJSON(raw) : tryParseJSON(raw);

      if (parsed) {
        // 3) ambil string terbaik dari objek
        const found = findFirstStringDeep(parsed);
        if (found) replyStr = found;
        else replyStr = "```json\n" + JSON.stringify(parsed, null, 2) + "\n```";
      } else {
        replyStr = raw; // memang teks biasa
      }

      // 4) bersihkan whitespace
      replyStr = (replyStr ?? "").toString().trim();

      // 5) fallback ramah – hindari '-' atau kosong yang bikin bullet kosong
      if (!replyStr || replyStr === "-" || replyStr === "—") {
        replyStr = "_(Tidak ada jawaban dari server)_";
      }

      setMessages((m) => [
        ...m,
        res.ok
          ? { role: "assistant", content: replyStr }
          : { role: "assistant", isError: true, content: replyStr || "Terjadi kesalahan." },
      ]);
    } catch (e) {
      console.error("[chatbot] error:", e);
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          isError: true,
          content: "Maaf, ada masalah jaringan. Coba lagi ya.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4 text-emerald-800">Chatbot</h2>

      <MessagesList messages={messages} loading={loading} />

      <div className="mt-3 flex gap-2">
        <textarea
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Tulis pertanyaan lalu Enter…"
          className="flex-1 rounded-xl border p-3 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-300"
        />
        <button
          onClick={send}
          disabled={loading || !input.trim()}
          className="px-4 py-2 rounded-xl bg-emerald-600 text-white disabled:opacity-50 hover:bg-emerald-700"
        >
          Kirim
        </button>
      </div>
    </div>
  );
}
