# Link Cleaner (공유 링크 꼬리표 제거)

[English](README.md)

"공유하기"나 "링크 복사"를 누를 때 링크 뒤에 붙는 추적 꼬리표를 자동으로 지워 주는 크롬 확장 프로그램입니다.

```
https://x.com/user/status/123?a=8fkf36ERdo&s=20   ->  https://x.com/user/status/123
https://youtu.be/dQw4w9WgXcQ?si=AbC123&t=42       ->  https://youtu.be/dQw4w9WgXcQ?t=42
https://www.instagram.com/p/ABC123/?igsh=MXx  ->  https://www.instagram.com/p/ABC123/
```

## 지우는 것

- **X / 트위터**: 트윗·프로필 주소의 `?` 뒤 전부 (검색 주소는 그대로 둠)
- **유튜브**: `si`, `feature`, `pp` (시작 시간 `t=`와 `list=`는 유지)
- **모든 사이트**: `utm_*`, `fbclid`, `gclid`, `igsh`, `igshid`, `msclkid`, `mc_cid` 등
- **알리익스프레스**: 상품 주소(`/item/123.html`)는 `?` 뒤 전부를 지우고, 페이지를 열자마자 주소창도 깨끗하게 바꿈
- **인스타그램**: 게시물·릴스·스토리·프로필 주소의 `?` 뒤 전부 (캐러셀 몇 번째 사진인지 `img_index`만 유지), 페이지를 열자마자 주소창도 깨끗하게 바꿈
- **그 외**: 틱톡, 페이스북, 아마존의 추적 파라미터

## 동작 방식

페이지 컨텍스트에서 실행되는 콘텐츠 스크립트가 다음을 가로채 주소를 정리합니다.

- `navigator.clipboard.writeText` / `write` ("링크 복사" 버튼)
- `navigator.share` (시스템 공유창)
- `copy` 이벤트 (Ctrl+C, 숨은 입력창을 쓰는 `execCommand('copy')`)

## 주소창 복사

주소창에서 Ctrl+C로 복사하는 것은 크롬 자체 동작이라 확장 프로그램이 가로챌 수 없습니다. 대신 **Alt+C**(또는 툴바 아이콘 클릭)를 누르면 현재 탭의 정리된 주소가 복사되고, 아이콘에 `OK`가 잠깐 표시됩니다. 단축키는 `chrome://extensions/shortcuts`에서 바꿀 수 있습니다.

네트워크 요청은 하지 않습니다. 권한: `activeTab`, `scripting`(단축키를 누를 때 현재 탭 주소를 읽고 클립보드에 복사), `clipboardWrite`.

## 설치

1. [최신 ZIP 다운로드](https://github.com/sogogi445/link-cleaner/releases/latest/download/link-cleaner-v1.2.0.zip) 후 압축을 풉니다.
2. 크롬에서 `chrome://extensions`를 열고 **개발자 모드**를 켭니다.
3. **압축해제된 확장 프로그램을 로드합니다**를 눌러 폴더를 선택합니다.

Chrome 111 이상이 필요합니다.

## 직접 고치기

`clean.js` 위쪽의 `GLOBAL`, `BY_HOST` 목록을 수정하고 확장을 새로고침하세요.

## 라이선스

MIT
