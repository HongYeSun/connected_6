# 1. 사용자 정보 저장 및 접근하기

사용자 정보 저장 및 접근하기는 클라이언트로부터 받은 사용자 정보를 데이터베이스에 저장 및 수정하거나 요청된 사용자 정보를 반환하는 API입니다.

## 1.1. Create user

데이터베이스에 저장 요청 받은 새로운 사용자 정보를 데이터베이스에 저장하고 사용자 정보를 응답합니다.

### Request

| ID | URL | HOST | METHOD |
| --- | --- | --- | --- |
| BA01-1 | /api/users | http://localhost:4000 | POST |

### Parameter

| Name | Type | Description | Required |
| --- | --- | --- | --- |
| username | string | 사용자명 | TRUE |
| email | string | 이메일 | TRUE |
| password | string | 비밀번호 | TRUE |
| profilePicture | Number(1~15) | 프로필 사진 번호 | TRUE |
| gender | string(female,male,other) | 성별 | TRUE |
| age | Number | 나이 | TRUE |

### Response

| Status code | Name | Type | Description |
| --- | --- | --- | --- |
| 200 |  | Object[] | 생성한 사용자의 정보 객체 |
| 400 | message | string | 중복된 이메일 에러메시지 |
| 403 | message | string | 이미 로그인한 상태 에러메시지 |
| 500 | message | string | 서버 오류 에러메시지 |

## 1.2. Login

사용자가 로그인합니다. 로그인 시 프론트로 쿠키를 보내줍니다.

### Request

| ID | URL | HOST | METHOD |
| --- | --- | --- | --- |
| BA01-2 | /api/users/login | http://localhost:4000 | POST |

### Parameter

| Name | Type | Description | Required |
| --- | --- | --- | --- |
| email | string | 이메일 | TRUE |
| password | string | 비밀번호 | TRUE |

### Response

| Status code | Name | Type | Description |
| --- | --- | --- | --- |
| 200 |  | Object[] | 로그인한 사용자의 정보 객체 |
| 403 | message | string | 이미 로그인한 상태 에러메시지 |
| 401 | message | string | 비밀번호 오류 에러메시지 |
| 401 | message | string | 이메일 오류 에러메시지 |
| 500 | message | string | 서버 오류 에러메시지 |

## 1.3. Logout

사용자 로그아웃합니다.

### Request

| ID | URL | HOST | METHOD |
| --- | --- | --- | --- |
| BA01-3 | /api/users/logout | http://localhost:4000 | GET |

### Parameter

None

### Response

| Status code | Name | Type | Description |
| --- | --- | --- | --- |
| 403 | message | string | 이미 로그아웃한 상태 에러메시지 |

## 1.4. Update user

사용자 정보를 업데이트합니다.

### Request

| ID | URL | HOST | METHOD |
| --- | --- | --- | --- |
| BA01-4 | /api/users/:id | http://localhost:4000 | PUT |

### Parameter

| Name | Type | Description | Required |
| --- | --- | --- | --- |
| username | string | 사용자명 | FALSE |
| email | string | 이메일 | FALSE |
| password | string | 비밀번호 | FALSE |
| profilePicture | Number(1~15) | 프로필 사진 번호 | FALSE |
| gender | female, male, other | 성별 | FALSE |
| age | Number | 나이 | FALSE |

### Response

| Status code | Name | Type | Description |
| --- | --- | --- | --- |
| 200 |  | Object[] | 업데이트한 사용자의 정보 객체 |
| 404 | message | string | 존재하지 않는 계정 에러메시지 |

## 1.5.  Access times

사용자의 이번 주, total 접속 시간 배열을 반환합니다.

### Request

| ID | URL | HOST | METHOD |
| --- | --- | --- | --- |
| BA01-5 | /api/users/access-times | http://localhost:4000 | GET |

### Parameter

None

### Response

| Status code | Name | Type | Description |
| --- | --- | --- | --- |
| 200 |  | Object[] | total과 week 각각의 접속 시간 배열 |
| 403 | message | stirng | 로그인이 필요하다는 에러메시지 |
| 404 | message | string | 존재하지 않는 계정 에러메시지 |
| 500 | message | string | 기타 에러메시지 |

## 1.6. Update last watched time

사용자가 비디오 시청을 마치고 화면을 나갈 때, 해당 비디오의 마지막 시청 시간을 업데이트합니다. 요청 바디의 lastWatched는 마지막 시청 시간을 JSON 형식으로 전달해야 합니다.

### Request

| ID | URL | HOST | METHOD |
| --- | --- | --- | --- |
| BA03-4 | /api/videos/:videoId | http://localhost:4000 | POST |

### Parameter

| Name | Type | Description | Required |
| --- | --- | --- | --- |
| videoId | string | 시청을 마친 비디오의 ID | TRUE |

### Body

| Name | Type | Description | Required |
| --- | --- | --- | --- |
| lastWatched | int | 마지막으로 시청한 초 | TRUE |

### Response

| Status code | Name | Type | Description |
| --- | --- | --- | --- |
| 200 | message | string | 업데이트 성공 메시지 |
| 404 | message | string | ID와 일치하는 비디오가 없다는 에러메시지 |
| 500 | message | string | 서버 오류 에러메시지 |

# 2. 비디오 목록 불러오기

비디오 목록 불러오기는 클라이언트로부터 특정 비디오 목록을 요청 받았을 때 해당 데이터를 반환하는 API입니다.

## 2.1. Liked videos

사용자가 좋아요한 동영상들에 대한 정보를 반환합니다.

### Request

| ID | URL | HOST | METHOD |
| --- | --- | --- | --- |
| BA02-1 | /api/users/like | http://localhost:4000 | GET |

### Parameter

None

### Response

| Status code | Name | Type | Description |
| --- | --- | --- | --- |
| 200 |  | Object[] | 동영상 객체들의 리스트 |
| 403 | message | stirng | 로그인이 필요하다는 에러메시지 |
| 404 | message | string | 존재하지 않는 계정 에러메시지 |
| 500 | message | string | 기타 에러메시지 |

## 2.2. Bookmarked videos

사용자가 북마크한 동영상들에 대한 정보를 반환합니다.

### Request

| ID | URL | HOST | METHOD |
| --- | --- | --- | --- |
| BA02-2 | /api/users/bookmark | http://localhost:4000 | GET |

### Parameter

None

### Response

| Status code | Name | Type | Description |
| --- | --- | --- | --- |
| 200 |  | Object[] | 동영상 객체들의 리스트 |
| 403 | message | stirng | 로그인이 필요하다는 에러메시지 |
| 404 | message | string | 존재하지 않는 계정 에러메시지 |
| 500 | message | string | 기타 에러메시지 |

## 2.3. Recent videos

사용자가 최근에 시청한 동영상들에 대한 정보를 최대 10개까지 반환합니다.

### Request

| ID | URL | HOST | METHOD |
| --- | --- | --- | --- |
| BA02-3 | /api/users/recent-videos | http://localhost:4000 | GET |

### Parameter

None

### Response

| Status code | Name | Type | Description |
| --- | --- | --- | --- |
| 200 |  | Object[] | 동영상 객체들의 리스트 |
| 403 | message | stirng | 로그인이 필요하다는 에러메시지 |
| 404 | message | string | 존재하지 않는 계정 에러메시지 |
| 500 | message | string | 기타 에러메시지 |

## 2.4. Popular videos

전체(total)와 각 성별(female, male, other)에 대한 인기 동영상들의 목록을 반환합니다.

### Request

| ID | URL | HOST | METHOD |
| --- | --- | --- | --- |
| BA02-4 | /api/users/popular-videos | http://localhost:4000 | GET |

### Parameter

None

### Response

| Status code | Name | Type | Description |
| --- | --- | --- | --- |
| 200 |  | Object[] | female, male, other, total 각각마다 동영상 객체들의 리스트 |
| 403 | message | stirng | 로그인이 필요하다는 에러메시지 |
| 404 | message | string | 존재하지 않는 계정 에러메시지 |
| 500 | message | string | 기타 에러메시지 |

# 3. 비디오 정보 저장 및 접근하기

비디오 정보 저장 및 접근하기는 클라이언트로부터 받은 비디오 정보를 데이터베이스에 저장 및 수정하거나 요청된 비디오 정보를 반환하는 API입니다.

## 3.1. Create videos

데이터베이스에 저장 요청 받은 새로운 비디오 정보를 데이터베이스에 저장하고 비디오 정보를 응답합니다.

### Request

| ID | URL | HOST | METHOD |
| --- | --- | --- | --- |
| BA03-1 | /api/videos | http://localhost:4000 | POST |

### Parameter

| Name | Type | Description | Required |
| --- | --- | --- | --- |
| title | string | 비디오 제목 | TRUE |
| subtitle | string | 제작자 혹은 부제목 | TRUE |
| description | string | 비디오 설명 | TRUE |
| thumb | string | 썸네일 이미지 URL | TRUE |
| source | string | 비디오 소스 URL | TRUE |

### Response

| Status code | Name | Type | Description |
| --- | --- | --- | --- |
| 201 |  | Object[] | 생성한 비디오의 정보 객체 |
| 500 | message | string | 서버 오류 에러메시지 |

## 3.2. Like button

사용자가 이미 해당 비디오에 좋아요를 누른 경우에는 좋아요가 취소됩니다. 기존에 좋아요를 누른 적 없는 경우에는 좋아요가 등록됩니다.

### Request

| ID | URL | HOST | METHOD |
| --- | --- | --- | --- |
| BA03-2 | /api/videos/like/:videoId | http://localhost:4000 | POST |

### Parameter

| Name | Type | Description | Required |
| --- | --- | --- | --- |
| videoId | string | 좋아요 누른 비디오 ID | TRUE |

### Response

| Status code | Name | Type | Description |
| --- | --- | --- | --- |
| 200 | flag | boolean | true: 좋아요 등록, false: 좋아요 취소 |
|  | videoLike | Number | 비디오의 좋아요 개수 |
| 403 | message | string | 로그인이 필요하다는 에러메시지 |
| 500 | message | string | 서버 오류 에러메시지 |

## 3.3. Bookmark button

사용자가 이미 해당 비디오에 북마크를 누른 경우에는 북마크가 취소됩니다. 기존에 북마크를 누른 적 없는 경우에는 북마크가 등록됩니다.

### Request

| ID | URL | HOST | METHOD |
| --- | --- | --- | --- |
| BA03-3 | /api/videos/bookmark/:videoId | http://localhost:4000 | POST |

### Parameter

| Name | Type | Description | Required |
| --- | --- | --- | --- |
| videoId | string | 북마크 누른 비디오 ID | TRUE |

### Response

| Status code | Name | Type | Description |
| --- | --- | --- | --- |
| 200 | flag | boolean | true: 북마크 등록, false: 북마크 취소 |
|  | videoLike | Number | 비디오의 북마크 개수 |
| 403 | message | string | 로그인이 필요하다는 에러메시지 |
| 500 | message | string | 서버 오류 에러메시지 |

## 3.4. Video access

request parameter의 video ID와 일치하는 비디오의 정보를 반환합니다.

### Request

| ID | URL | HOST | METHOD |
| --- | --- | --- | --- |
| BA03-4 | /api/videos/:videoId | http://localhost:4000 | GET |

### Parameter

| Name | Type | Description | Required |
| --- | --- | --- | --- |
| videoId | string | 조회할 비디오 ID | TRUE |

### Response
