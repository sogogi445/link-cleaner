# Link Cleaner (공유 링크 꼬리표 제거)

[English](README.md)

"공유하기"나 "링크 복사"를 누를 때 링크 뒤에 붙는 추적 꼬리표를 자동으로 지워 주는 크롬 확장 프로그램입니다.

```
https://x.com/user/status/123?a=8fkf36ERdo&s=20   ->  https://x.com/user/status/123
https://youtu.be/dQw4w9WgXcQ?si=AbC123&t=42       ->  https://youtu.be/dQw4w9WgXcQ?t=42
```

## 지우는 것

- **X / 트위터**: 트윗·프로필 주소의 `?` 뒤 전부 (검색 주소는 그대로 둠)
- **유튜브**: `si`, `feature`, `pp` (시작 시간 `t=`와 `list=`는 유지)
- **모든 사이트**: `utm_*`, `fbclid`, `gclid`, `igsh`, `igshid`, `msclkid`, `mc_cid` 등
- **그 외**: 틱톡, 페이스북, 인스타그램, 아마존의 추적 파라미터

## 동작 방식

페이지 컨텍스트에서 실행되는 콘텐츠 스크립트가 다음을 가로채 주소를 정리합니다.

- `navigator.clipboard.writeText` / `write` ("링크 복사" 버튼)
- `navigator.share` (시스템 공유창)
- `copy` 이벤트 (Ctrl+C, 숨은 입력창을 쓰는 `execCommand('copy')`)

권한이 필요 없고 네트워크 요청도 하지 않습니다.

## 설치

1. 이 저장소를 내려받아(Code -> Download ZIP) 압축을 풉니다.
2. 크롬에서 `chrome://extensions`를 열고 **개발자 모드**를 켭니다.
3. **압축해제된 확장 프로그램을 로드합니다**를 눌러 폴더를 선택합니다.

Chrome 111 이상이 필요합니다.

## 직접 고치기

`clean.js` 위쪽의 `GLOBAL`, `BY_HOST` 목록을 수정하고 확장을 새로고침하세요.

## 라이선스

MIT
