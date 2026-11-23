'use strict';

const state = document.getElementById('status');
const retry = document.getElementById('retry');
const remoteRepository = 'xoqhdgh1002/cms-analysis-entry';
const pointerUrl = `https://api.github.com/repos/${remoteRepository}/contents/tunnel.json?ref=route`;
const protectedTunnel = /^https:\/\/[a-z0-9]+(?:-[a-z0-9]+)*\.trycloudflare\.com\/?$/;

async function connect() {
  state.textContent = '이메일 PIN 로그인으로 연결 중입니다.';
  retry.hidden = true;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await fetch(`${pointerUrl}&v=${Date.now()}`, {
        headers: { Accept: 'application/vnd.github.raw+json' },
        cache: 'no-store', credentials: 'omit', signal: AbortSignal.timeout(4500),
      });
      if (!response.ok) throw new Error('Route unavailable');
      const { url } = await response.json();
      if (typeof url !== 'string' || !protectedTunnel.test(url)) throw new Error('Invalid route');
      window.location.replace(url);
      return;
    } catch {
      if (attempt < 2) await new Promise(resolve => setTimeout(resolve, 600 * (attempt + 1)));
    }
  }
  state.textContent = '작업공간 주소를 확인하지 못했습니다. 잠시 뒤 다시 연결해 주세요.';
  retry.hidden = false;
}

retry.addEventListener('click', connect);
connect();
