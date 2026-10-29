(() => {
  // 모든 사이트에서 지우는 추적 파라미터
  const GLOBAL = [
    /^utm_/i, /^fbclid$/i, /^gclid$/i, /^gclsrc$/i, /^dclid$/i, /^msclkid$/i,
    /^igshid$/i, /^igsh$/i, /^mc_cid$/i, /^mc_eid$/i, /^_hsenc$/i, /^_hsmi$/i,
    /^ref_src$/i, /^ref_url$/i, /^si$/i, /^feature$/i, /^pp$/i, /^share_id$/i,
    /^spm$/i, /^scm$/i, /^trk$/i, /^trkid$/i, /^yclid$/i, /^twclid$/i,
  ];
  // 특정 사이트에서만 지우는 파라미터 (t는 유튜브에선 타임스탬프라 보존)
  const BY_HOST = [
    [/(^|\.)(x|twitter)\.com$/i, [/^s$/i, /^t$/i]],
    [/(^|\.)(instagram|threads)\.(com|net)$/i, [/^utm_/i, /^hl$/i]],
    [/(^|\.)tiktok\.com$/i, [/^_t$/i, /^_r$/i, /^is_from_webapp$/i, /^sender_device$/i, /^web_id$/i, /^refer$/i, /^checksum$/i, /^u_code$/i]],
    [/(^|\.)(facebook|fb)\.com$/i, [/^mibextid$/i, /^rdid$/i, /^sfnsn$/i]],
    [/(^|\.)aliexpress\.[a-z.]+$/i, [/^aff_/i, /^algo_/i, /^pdp_/i, /^sourceType$/i, /^channel$/i, /^afSmartRedirect$/i, /^gatewayAdapt$/i, /^tt$/i, /^businessType$/i, /^src$/i, /^sk$/i, /^aff$/i, /^dp$/i, /^terminal_id$/i, /^utparam/i]],
    [/(^|\.)amazon\.[a-z.]+$/i, [/^tag$/i, /^ref_?$/i, /^pf_rd_/i, /^pd_rd_/i, /^qid$/i, /^sr$/i, /^crid$/i, /^sprefix$/i, /^keywords$/i]],
  ];

  const URL_RE = /https?:\/\/[^\s<>"'`]+/g;

  function cleanUrl(str) {
    let u;
    try { u = new URL(str); } catch { return str; }
    // X: 트윗/프로필 주소는 쿼리가 전부 불필요 (a, s, t, ref_src 등 알 수 없는 값 포함)
    if (/(^|\.)(x|twitter)\.com$/i.test(u.hostname) &&
        /^\/(?:[^/]+\/status(?:es)?\/\d+(?:\/.*)?|(?!search|i|hashtag|explore|home|settings|intent|share)[^/]+\/?)$/i.test(u.pathname)) {
      if (!u.search) return str;
      u.search = "";
      return u.toString();
    }
    // 알리익스프레스: 상품 주소(/item/숫자.html)는 쿼리가 전부 불필요
    if (/(^|\.)aliexpress\.[a-z.]+$/i.test(u.hostname) && /^\/(?:i|item)\/\d+\.html$/i.test(u.pathname)) {
      if (!u.search) return str;
      u.search = "";
      return u.toString();
    }
    // 인스타그램: 게시물/릴스/프로필 주소는 캐러셀 번호(img_index)만 남기고 쿼리 전부 삭제
    if (/(^|\.)instagram\.com$/i.test(u.hostname) &&
        !/^\/(?:accounts|explore\/search|direct|challenge|api|graphql)(?:\/|$)/i.test(u.pathname)) {
      const keep = u.searchParams.get("img_index");
      if (!u.search) return str;
      u.search = keep ? "?img_index=" + encodeURIComponent(keep) : "";
      return u.toString();
    }
    // 스레드: 게시물/프로필 주소는 쿼리(xmt, slof 등)가 전부 불필요 (검색 주소는 제외)
    if (/(^|\.)threads\.(com|net)$/i.test(u.hostname) && !/^\/search(?:\/|$)/i.test(u.pathname)) {
      if (!u.search) return str;
      u.search = "";
      return u.toString();
    }
    const rules = GLOBAL.slice();
    for (const [hostRe, list] of BY_HOST) if (hostRe.test(u.hostname)) rules.push(...list);
    let changed = false;
    for (const key of [...u.searchParams.keys()]) {
      if (rules.some((r) => r.test(key))) { u.searchParams.delete(key); changed = true; }
    }
    return changed ? u.toString() : str;
  }

  function cleanText(text) {
    if (typeof text !== "string" || !text.includes("http")) return text;
    return text.replace(URL_RE, (m) => {
      // 문장 끝 구두점은 URL에서 제외
      const tail = (m.match(/[.,!?)\]]+$/) || [""])[0];
      return cleanUrl(tail ? m.slice(0, -tail.length) : m) + tail;
    });
  }

  // 1) 클립보드 API (유튜브/X의 '링크 복사' 버튼)
  try {
    const cb = navigator.clipboard;
    if (cb && cb.writeText) {
      const orig = cb.writeText.bind(cb);
      cb.writeText = (t) => orig(cleanText(t));
    }
    if (cb && cb.write && window.ClipboardItem) {
      const origWrite = cb.write.bind(cb);
      cb.write = async (items) => {
        try {
          const out = [];
          for (const item of items) {
            const data = {};
            for (const type of item.types) {
              let blob = await item.getType(type);
              if (type === "text/plain" || type === "text/html") {
                blob = new Blob([cleanText(await blob.text())], { type });
              }
              data[type] = blob;
            }
            out.push(new ClipboardItem(data));
          }
          return origWrite(out);
        } catch { return origWrite(items); }
      };
    }
  } catch {}

  // 2) 모바일/OS 공유 시트 (Web Share API)
  try {
    if (navigator.share) {
      const orig = navigator.share.bind(navigator);
      navigator.share = (d) => orig(d ? {
        ...d,
        url: d.url ? cleanUrl(d.url) : d.url,
        text: d.text ? cleanText(d.text) : d.text,
      } : d);
    }
  } catch {}

  // 3) 입력창을 선택해 Ctrl+C 로 복사하는 경우
  if (typeof document !== "undefined") document.addEventListener("copy", (e) => {
    try {
      const a = document.activeElement;
      const sel = a && /^(INPUT|TEXTAREA)$/.test(a.tagName) && a.selectionStart != null
        ? a.value.slice(a.selectionStart, a.selectionEnd)
        : String(document.getSelection());
      const cleaned = cleanText(sel);
      if (cleaned !== sel && e.clipboardData) {
        e.clipboardData.setData("text/plain", cleaned);
        e.preventDefault();
      }
    } catch {}
  }, true);

  // 4) 알리익스프레스/인스타그램/스레드: 페이지를 열자마자 주소창의 추적 꼬리표를 정리
  try {
    if (window === window.top && /(^|\.)(aliexpress\.[a-z.]+|instagram\.com|threads\.(?:com|net))$/i.test(location.hostname) && location.search) {
      const clean = cleanUrl(location.href);
      if (clean !== location.href) history.replaceState(history.state, "", clean);
    }
  } catch {}

  // 테스트용 노출
  if (typeof module !== "undefined") module.exports = { cleanUrl, cleanText };
  // background.js(서비스 워커)에서 importScripts 로 불러 쓸 때
  if (typeof importScripts === "function") self.cleanUrl = cleanUrl;
})();
