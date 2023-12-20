# **WebOS TV App *“BeanBox”*** Test Plan

## Overview

이 테스트 계획은 enact-react-express-aws S3로 구성된 WebOS TV App의 테스트를 위한 전체적인 접근 방식과 테스트 케이스를 기술합니다. 테스트는 FE(프론트엔드)와 BE(백엔드) 간의 상호작용, DB에 저장된 회원 정보 및 영상 목록과 썸네일, 영상 정보, 영상 링크(m3u8) 등의 데이터 정확성, 기능적인 측면 등을 확인할 수 있도록 구성되었습니다.

## Environment

- FE : Enact, React
- BE : Express
- DB : MongoDB Atlas, AWS S3 (미디어 서버)

## Test Preconditions

enact-react-express-aws S3로 구성된 WebOS TV App이 성공적으로 배포되었음. DB에는 영상 목록과 썸네일, 영상 정보, 영상 링크(m3u8) 등의 영상데이터와 유저 데이터가 저장되어 있음. FE와 BE 간의 통신이 정상적으로 이루어짐.

## Test Scenarios

### ****1. Login Functionality****

### 목적: **사용자 로그인 기능을 테스트함.**

| Test Step | Expected Result | Test Data | API |
| --- | --- | --- | --- |
| FE는 이메일과 비밀번호를 사용하여 로그인을 시도함. | 로그인 성공시 메인 페이지로 이동, 실패시 오류 메시지 표시. | { <br>　"email":"example@example.com",<br>　"password": "비밀번호"<br>} | /api/users/login |
| BE는 FE의 로그인 요청을 처리하고 결과를 반환함. | BE는 로그인 요청을 올바르게 처리하고 결과를 FE에 반환함. |  |  |


### 2. ****Profile Selection Functionality****

### 목적: 사용자 **프로필 선택 기능을 테스트함.**

| Test Step | Expected Result | TestData | API |
| --- | --- | ---- | --- |
| FE에서 사용자가 프로필 이미지를 선택함. | 선택된 프로필 이미지가 저장되고 메인 페이지로 이동. | { <br>　"profilePicture": 8　<br>  } | /api/users/${userId} |
| BE는 선택된 프로필 정보를 처리하고 저장함. | 프로필 정보가 DB에 올바르게 저장됨. |  |  |
| FE에서 사용자는 프로필 이미지 선택 이후 자동로그인이 됨. | 자동 로그인 이후 메인페이지로 이동. |  | api/users/auto-login |


### 3. ****Registration Functionality****

### 목적: **사용자 회원가입 기능을 테스트함.**

| Test Step | Expected Result | Test Data | API |
| --- | --- | --- | --- |
| FE에서 사용자가 회원가입 정보를 입력하고 제출함. | 회원가입 성공시 프로필 선택 페이지로 이동, 실패시 오류 메시지를 표시함. | {<br>　"username": "사용자명",<br>　"email": "이메일",<br>　"password": "비밀번호",<br>　"profilePicture": 1,<br>　"gender": "female",<br>　"age": 25<br>} | /api/users |
| BE는 회원가입 요청을 처리하고 결과를 반환함. | 회원가입 요청이 올바르게 처리되고 사용자 데이터가 DB에 저장됨. | 　　　　　　　　　　　　 |  |


### 4. Logout ****Functionality****

### 목적: **사용자 로그아웃 기능을 테스트함.**

| Test Step | Expected Result | API |
| --- | --- | --- |
| FE에서 사용자가 로그아웃 버튼을 눌러 로그아웃을 시도함. | 로그아웃 성공시 로그인 페이지로 이동, 실패시 오류 메시지를 표시함. | /api/users/logout |
| BE는 로그아웃 요청을 처리하고 결과를 반환함. | 로그아웃 요청이 올바르게 처리됨. |  |


### 5. ****Video Playback Functionality****

### 목적: **비디오(mp4, m3u8) 재생 기능 및 비디오 이어보기 기능을 테스트함.**

| Test Step | Expected Result | Test Data | API |
| --- | --- | --- | --- |
| FE에서 사용자가 비디오를 선택하여 재생함. | 선택된 비디오가 정상적으로 재생됨. mp4 형식의 비디오는 tab2에서, m3u8형식의 비디오는 tab으로 이동하여 재생됨. | { <br>　"video": {<br>　　"_id": "6123456789abcdef01234567",<br>　　"title": "샘플 비디오 제목",<br>　　"description": "샘플 비디오 설명",<br>　　"genderViews": {<br>　　"female": 10,<br>　　"male": 15,<br>　　"other": 5<br>　},<br>　"views": 30,<br>　"createdAt": "2023-12-01T12:34:56.789Z",<br>　"updatedAt": "2023-12-08T11:22:33.444Z"<br>　},<br>　"lastWatched": 1234<br>} | /api/videos/${videoId} |
| BE는 비디오 재생에 필요한 데이터를 FE에 제공함. | 비디오 정보 및 재생 관련 데이터가 FE에 올바르게 전달됨. |  |  |
| BE는 비디오 재생에 필요한 데이터를 FE에 제공함. | 비디오 정보 및 재생 관련 데이터가 FE에 올바르게 전달됨. |  |  |
| FE에서 사용자가 이전에 시청을 멈춘 지점부터 비디오를 재생함. | 사용자가 마지막으로 시청한 지점부터 비디오가 이어서 재생됨. | {<br>　"lastWatched": <마지막 시청 초(int형)><br>} 　　　　　　　　　　　　　　　　　　　　| /api/videos/${videoId} |


### 6. Personal Experience Data Update Functionality

### 목적: 최근 시청, 좋아요, 북마크 영상 정보의 갱신을 테스트함.

| Test Step　　　　　　　 | Expected Result | Test Data1 　　　　　　　　　　　　　　　　| API1 | Test Data2 　　　　　　　　　　| API2 |
| --- | --- | ---| --- | ---| --- |
| FE에서 사용자가 비디오를 선택하여 시청함. | BE에서 선택된 비디오의 view가 증가하고, 유저의 recentVideos 목록에 선택된 비디오의 id가 추가됨. | [<br>　{<br>　　"_id": "동영상 ID",<br>　　"title": "동영상 제목",<br>　　"subtitle": "동영상 부제목",<br>　　"description": "동영상 설명",<br>　　"thumb": "동영상 썸네일 URL",<br>　　"source": "동영상 소스 URL",<br>　　"bookmark": 0,<br>　　"like": 0,<br>　　"views": 0<br>　 },<br>] | /api/videos/${videoId} |  |  |
| FE에서 사용자가 비디오 시청 중 좋아요 버튼을 누름.  | BE에서 좋아요 누른 비디오의 like가 증가하고, 유저의 likedVideos 목록에 선택된 비디오의 id가 추가됨. | [<br>　{<br>　　"_id": "동영상 ID",<br>　　"title": "동영상 제목",<br>　　"subtitle": "동영상 부제목",<br>　　"description": "동영상 설명",<br>　　"thumb": "동영상 썸네일 URL",<br>　　"source": "동영상 소스 URL",<br>　　"bookmark": 0,<br>　　"like": 0,<br>　　"views": 0<br>　},<br>] | /api/videos/like/${http://prop.id/ | {<br>　"flag": true,<br>　"videoLike": 1<br>} | /api/videos/isliked/${http://prop.id/} |
| FE에서 사용자가 비디오 시청 중 북마크 버튼을 누름.  | BE에서 북마크한 비디오의 bookmark가 증가하고, 유저의 bookmarkedVideos 목록에 선택된 비디오의 id가 추가됨. | [<br>　{<br>　　"_id": "동영상 ID",<br>　　"title": "동영상 제목",<br>　　"subtitle": "동영상 부제목",<br>　　"description": "동영상 설명",<br>　　"thumb": "동영상 썸네일 URL",<br>　　"source": "동영상 소스 URL",<br>　　"bookmark": 0,<br>　　"like": 0,<br>　　"views": 0<br>　},<br>] | /api/videos/bookmark/${http://prop.id/} | {<br>　"flag": true,<br>　"videoBookmark": 1<br>} | /api/videos/isbookmarked/${http://prop.id/} |


### 7. Personal Experience Data Display Functionality

### 목적: 최근 시청, 좋아요, 북마크 영상 리스트 제공을 테스트함.

| Test Step | Expected Result | Test Data　　　　　　　　　　　　　　　　　　　　 | API |
| --- | --- | --- | --- |
| FE가 BE에 유저가 최근 시청한 비디오 목록을 요청함. | BE에서 FE에 유저의 recentVideos 목록을 반환함.  | {<br>　"username": "exameple_user",<br>　"email": "exampsdfle@example.com",<br>　"profilePicture": 5,<br>　"gender": "female",<br>　"age": 25,<br>　"likedVideos":[],<br>　"bookmarkedVideos":[],<br>　"recentVideos":[],<br>　"accessTimes":[<br>　　0,<br>　　0,<br>　　0,<br>　　0,<br>　　0,<br>　　0,<br>　　0,<br>　　0,<br>　　0,<br>　　0,<br>　　0,<br>　　0,<br>　　0,<br>　　0,<br>　　0,<br>　　0,<br>　　0,<br>　　0,<br>　　0,<br>　　0,<br>　　0,<br>　　0,<br>　　0,<br>　　0<br>　],<br>　"_id": "656362fd20a28f72786d9fff",<br>　"lastRequestTime": "2023-11-26T15:23:41.753Z"<br>} | /api/users/recent-videos |
| FE는 BE에서 제공 받은 recentVideos 목록을 렌더링함. | FE가 recentVideos를 영상 썸네일 이미지 아이템 목록 형태로 나열하여 제공함. |  |  |
| FE가 BE에 유저가 좋아요 누른 비디오 목록을 요청함. | BE에서 FE에 유저의 likedVideos 목록을 반환함. |  | /api/users/like |
| FE는 BE에서 제공 받은 likedVideos 목록을 렌더링함. | FE가  likedVideos를 영상 썸네일 이미지 아이템 목록 형태로 나열하여 제공함. |  |  |
| FE가 BE에 유저가 북마크한 비디오 목록을 요청함. | BE에서 FE에 유저의 bookmarkedVideos 목록을 반환함. |  | /api/users/bookmark |
| FE는 BE에서 제공 받은 bookmarkedVideos 목록을 렌더링함. | FE가 bookmarkedVideos를 영상 썸네일 이미지 아이템 목록 형태로 나열하여 제공함. |  |  |


### 8. ****User Analytics Display**** Functionality

### 목적: **사용자 스크린타임 데이터 표시 기능을 테스트함.**

| Test Step | Expected Result | Test Data　　　　　　　　　　　　　　　　　　　　　 | API |
| --- | --- | --- | --- |
| FE는 BE로 부터 유저의 최근 7일과 누적 스크린타임 데이터를 받아옴. | 유저의 accessTime과 weekAccessTime 데이터를 파싱하여 ScreenTimeData를 통해 Bar Graph를 제공함.  | {<br>　"total":[1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],<br>　"week":[1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1]<br>} | /api/users/access-times |
| BE는 DB에서 데이터를 조회하여 FE에 응답함. | 응답 실패시 실패 메세지를 전송하는 것을 확인함. |  |  |


### 9. Popular and All Video Data ****Display**** Functionality

### 목적: 인기 비디오 및 전체 비디오 리스트 제공을 테스트함.

| Test Step | Expected Result | Test Data　　　　　　　　　　　　　　 | API |
| --- | --- | --- | --- |
| FE는 BE로 부터 전체 인기 비디오 및 성별별 인기 비디오 리스트 받아옴.  | popularvideos 파싱을 통해 전체 회원 대상 인기 비디오 리스트와 유저 성별 대상 인기 비디오 리스트 제공.  | [<br>　"female":[<br>　　{<br>　　　"_id": "동영상 ID",<br>　　　"title": "동영상 제목",<br>　　　"subtitle": "동영상 부제목",<br>　　　"description": "동영상 설명",<br>　　　"thumb": "동영상 썸네일 URL",<br>　　　"source": "동영상 소스 URL",<br>　　　"bookmark": 0,<br>　　　"like": 0,<br>　　　"views": 0<br>　　},<br>　],<br>　"male":[ female과 동일],<br>　"other":[female과 동일],<br>　"total":[female과 동일]<br>] | /api/videos/top-videos |
| BE는 DB에서 데이터를 조회하여 FE에 응답함. | 응답 실패시 실패 메세지를 전송하는 것을 확인함. |  |  |


### ****10. Adaptive Streaming Functionality****

### 목적: ****HLS(High-Efficiency Streaming Protocol) 비디오 화질 조정 기능을 테스트함.****

| Test Step | Expected Result |
| --- | --- |
| FE에서 유저가 HLS 형식의 비디오를 선택하여 재생함. | HLS 비디오가 정상적으로 재생됨. 다양한 화질 옵션들이 제공됨. |
| FE에서 유저가 화질 조정 버튼을 클릭하여 화질을 변경함. | 선택된 화질에 따라 비디오의 재생 화질이 변경됨. |
| BE는 HLS 비디오 재생을 위한 데이터 및 화질 옵션을 FE에 제공함. | 비디오 정보 및 화질 선택 옵션들이 FE에 올바르게 전달됨. |


### ****11. CPU and Memory Status Monitoring Functionality****

### 목적: ****Luna service API를 통해 CPU와 메모리 상태를 모니터링하는 기능을 테스트함.****

| Test Step | Expected Result |
| --- | --- |
| FE에서 유저가 시스템 상태 확인 페이지를 열고 'Refresh' 버튼을 클릭함. | 시스템의 현재 CPU 및 메모리 상태가 정확하게 업데이트되고 표시됨. |
| FE에서 표시된 CPU 및 메모리 데이터가 Pie Chart로 시각적으로 표현됨. | 세부 정보(예: cur_vmallocSize, swapUsed, usable_memory, user, system 등)가 정확하게 표시되며, 최신 상태를 반영함. |


### ****12. CPU and Memory Status Monitoring Functionality during Video Playback****

### 목적: ****비디오 재생 중에도 Luna service API를 통해 CPU와 메모리 상태를 모니터링하는 기능을 테스트함.****

| Test Step | Expected Result |
| --- | --- |
| FE에서 유저가 비디오를 재생하고, 'Help' 버튼을 클릭하여 시스템 상태 확인 기능을 활성화함. | 시스템의 현재 CPU 및 메모리 상태가 정확하게 업데이트되고 표시됨. |
| FE에서 표시된 CPU 및 메모리 데이터가 실시간으로 갱신됨. | CPU 및 메모리 사용량이 실시간으로 갱신되며, 변경 사항이 반영됨 |
| FE에서  유저가 'Help' 버튼을 다시 클릭하여 시스템 상태 모니터링 기능을 비활성화함. | 시스템 상태 모니터링 기능이 비활성화되며, 비디오 재생 화면만이 표시됨. |
