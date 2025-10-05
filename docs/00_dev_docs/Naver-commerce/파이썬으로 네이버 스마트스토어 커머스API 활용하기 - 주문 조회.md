---
title: "파이썬으로 네이버 스마트스토어 커머스API 활용하기 - 주문 조회"
source: "https://private.tistory.com/142"
author:
  - "[[dev109]]"
published: 2022-12-05
created: 2025-10-05
description: "2022.11.25 - [프로그래밍/Python] - 파이썬으로 네이버 스마트스토어 커머스API 활용하기 - 애플리케이션아이디, 시크릿키 발급 파이썬으로 네이버 스마트스토어 커머스API 활용하기 - 애플리케이션아이디, 시크릿키 발급 네이버쇼핑에서 판매중인 인스타봇이나 스마트스토어 상품정보/ 사업자정보 프로그램은 구매자에게 쿠폰을 발급하고 인증하는 시스템이다. 물리적인 배송을 하지않고, 구매자의 정보에서 네 private.tistory.com 2022.11.25 - [프로그래밍/Python] - 파이썬으로 네이버 스마트스토어 커머스API 활용하기 - 인증 토큰 발급 파이썬으로 네이버 스마트스토어 커머스API 활용하기 - 인증 토큰 발급 2022.11.25 - [프로그래밍/Python] - 파이썬으로 네이버.."
tags:
  - "clippings"
---
목차 

프로그래밍/Python

목차 

[2022.11.25 - \[프로그래밍/Python\] - 파이썬으로 네이버 스마트스토어 커머스API 활용하기 - 애플리케이션아이디, 시크릿키 발급](https://private.tistory.com/140)

[

파이썬으로 네이버 스마트스토어 커머스API 활용하기 - 애플리케이션아이디, 시크릿키 발급

네이버쇼핑에서 판매중인 인스타봇이나 스마트스토어 상품정보/ 사업자정보 프로그램은 구매자에게 쿠폰을 발급하고 인증하는 시스템이다. 물리적인 배송을 하지않고, 구매자의 정보에서 네...

private.tistory.com

](https://private.tistory.com/140)

[2022.11.25 - \[프로그래밍/Python\] - 파이썬으로 네이버 스마트스토어 커머스API 활용하기 - 인증 토큰 발급](https://private.tistory.com/141)

[

파이썬으로 네이버 스마트스토어 커머스API 활용하기 - 인증 토큰 발급

2022.11.25 - \[프로그래밍/Python\] - 파이썬으로 네이버 스마트스토어 커머스API 활용하기 - 애플리케이션아이디, 시크릿키 발급 파이썬으로 네이버 스마트스토어 커머스API 활용하기 - 애플리케이션아...

private.tistory.com

](https://private.tistory.com/141)

---

스마트스토어의 커머스API를 사용하게된 목적은

수동으로 주문 조회 -> 구매자에게 메일 발송하던 시스템을 자동화하기 위함이다.

나름 주문 내역을 자주 확인하고 있지만 늦은 밤, 새벽, 주말, 운전중 등 확인이 바로 불가능한 상황이 있는데 이런 상황에도 나 대신 프로그램 다운로드 링크와 이용권을 자동으로 메일 발송할 수 있는 시스템이 꼭 필요했다.

상태별 주문 내역 조회 - 결제 완료 된 주문 정보 가져오기

**커머스 API 주문 조회에서 결제 완료된 주문 정보를 확인하기 위해서는 '변경 상품 주문 내역 조회'를 하면 된다.**

#### 변경 상품 주문 내역 조회에 필요한 요청 파라미터

![파이썬으로 네이버 스마트스토어 커머스API 활용하기 - 주문 조회 - undefined - undefined - 변경 상품 주문 내역 조회에 필요한 요청 파라미터](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FE4ebg%2FbtrSKPSHWA4%2FAAAAAAAAAAAAAAAAAAAAAIUt5s6cKBEjotOW05YigHZ0oKPN0PPWnhSJPfWIFBn5%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1761922799%26allow_ip%3D%26allow_referer%3D%26signature%3D8rjQAcBkYc4ZDQzPhKVCw3GE%252Fus%253D)

파이썬으로 네이버 스마트스토어 커머스API 활용하기 - 주문 조회 - undefined - undefined - 변경 상품 주문 내역 조회에 필요한 요청 파라미터

**조회 시작 일시(lastChangeFrom)의 datatime 형식은 ISO 8610에 따른 형태로 구성** 해야 하며, 커머스API 문서에서 필드값이 String<data-time> 형식인 경우 이에 해당된다고 한다. 또한 매 초의 정각을 표현하더라도 밀리초 표현(소수점)은 반드시 포함해야 한다.

#### 주문 상품 조회 소스

```python
def get_new_order_list():
    from datetime import datetime, timedelta

    headers = {'Authorization': token}
    url = 'https://api.commerce.naver.com/external/v1/pay-order/seller/product-orders/last-changed-statuses'
    
    now = datetime.now()
    # before_date = now - timedelta(hours=3) #3시간전
    # before_date = now - timedelta(seconds=10) #10초전
    # before_date = now - timedelta(minutes=10) #10분전
    before_date = now - timedelta(days=2) #이틀전
    iosFormat = before_date.astimezone().isoformat()

    params = {
            'lastChangedFrom' : iosFormat, #조회시작일시
            'lastChangedType' : 'DISPATCHED', #최종변경구분(PAYED : 결제완료, DISPATCHED : 발송처리)
        }

    res = requests.get(url=url, headers=headers, params=params)
    res_data = res.json()

    if 'data' not in res_data: #조회된 정보가 없을 경우 data키 없음
        print('주문 내역 없음')
        return False

    data_list = res_data['data']['lastChangeStatuses']

    for data in data_list:
        print(data) #주문 정보

get_new_order_list()
```

#### lastChangedType(최종 변경 구분) 상태 표

| **코드** | **설명** | **비고** |
| --- | --- | --- |
| PAY\_WAITING | 결제 대기 |  |
| PAYED | 결제 완료 |  |
| EXCHANGE\_OPTION | 옵션 변경 | 선물하기 |
| DELIVERY\_ADDRESS\_CHANGED | 배송지 변경 |  |
| GIFT\_RECEIVED | 선물 수락 | 선물하기 |
| CLAIM\_REJECTED | 클레임 철회 |  |
| DISPATCHED | 발송 처리 |  |
| CLAIM\_REQUESTED | 클레임 요청 |  |
| COLLECT\_DONE | 수거 완료 |  |
| CLAIM\_HOLDBACK\_RELEASED | 클레임 보류 해제 |  |
| CLAIM\_COMPLETED | 클레임 완료 |  |
| PURCHASE\_DECIDED | 구매 확정 |  |

요청 파라미터중 **조회 종료 일시(****lastChangedTo)를 생략할 경우 조회 시작 일시부터 24시간 후로 자동 지정** 된다.

실제로 서버에 올려서 자동으로 새로운 주문내역을 가져올 때는 조회 시작 일시를 3~10초전으로 할 예정이지만 현재는 응답 데이터가 있어야 포스팅을 할 수 있기때문에 2일전으로 설정했다. (새로운 주문 내역이 음슴)

같은 이유로 최종 변경 구분(lastChangedType)을 발송처리가 된 상태(DISPATCHED)로 요청했다.

내가 필요한 **최종 변경 구분(****lastChangedType)** 은 두가지다.

**PAYED(결제완료)** - 새로운 주문중 결제가 완료된 내역이 있을 경우 즉시 메일 발송을 위해

**DELIVERED(배송완료)** - 나같은 경우 비실물 판매 상품이기때문에 실제 배송이 필요하지 않고 메일만 발송하면 바로 배송완료 상태로 변경을 한다. 결제완료된 내역을 처리하고 배송 완료 상태로 변경한 후 정상적으로 배송완료 처리가 되었는지 확인 을 위해 필요하다.

위의 요청을 보내면 2일전부터 24시간동안 주문 내역 중 발송 처리가 완료된 내역을 응답받는다. 내가 실제로 사용할때는 결제 완료(PAYED) 상태로 요청해야 새로운 주문 중 결제가 완료된(바로 메일을 전송해야 하는) 내역을 응답 받을 수 있다.

![파이썬으로 네이버 스마트스토어 커머스API 활용하기 - 주문 조회 - undefined - undefined - lastChangedType(최종 변경 구분) 상태 표](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FbKIPVu%2FbtrSM4JBiC8%2FAAAAAAAAAAAAAAAAAAAAAKJdvjxhea6PM5eI3bW6_VGJVXOtzn7cjNuYtP2La5vb%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1761922799%26allow_ip%3D%26allow_referer%3D%26signature%3D7xMy2Q2nTfzqlzBhDV8rT%252FbhF3s%253D)

파이썬으로 네이버 스마트스토어 커머스API 활용하기 - 주문 조회 - undefined - undefined - lastChangedType(최종 변경 구분) 상태 표

응답받은 데이터는 data안에 lastChangeStatuses에서 확인이 가능하며, 조회된 주문 정보가 없을 경우 data키가 없다.

이렇게 커머스API를 이용하여 새로운 주문 정보를 받아올 수 있다. 이 얼마나 편리하고 간단한지....!! 하지만 여기서 끝이 아니다.

받아온 데이터는 주문ID(orderId), 상품 주문 ID(productOrderId), 최종 변경 구분 - 주문내역상태(lastChangedType), 결제 일시(paymentDate), 최종 변경 일시(lastChangedDate), 상품 주문 상태(productOrderStatus) 정도만 응답을 받기때문에 해당 정보로 구매자에게 메일을 보내거나 할 수는 없고 위의 응답으로 받은 상품 주문 ID(productOrderId)를 이용해 상품 주문 상세 내역 조회를 요청해야 해당 주문 내역에 대한 상세한 정보를 얻을 수 있다.

공감과 댓글은 작성자에게 많은 힘이됩니다. 감사합니다😄

[저작자표시 비영리 변경금지 (새창열림)](https://creativecommons.org/licenses/by-nc-nd/4.0/deed.ko)

#### ' > ' 카테고리의 다른 글

| [파이썬 selnium 크롬 로딩 중 '\[winerror 193\] %1은(는) 올바른 win32 응용 프로그램이 아닙니다' 에러 발생 해결 방법](https://private.tistory.com/178) (48) | 2024.08.01 |
| --- | --- |
| [파이썬으로 네이버 스마트스토어 커머스API 활용하기 - 주문 내역 상세 정보 조회, 발송 처리](https://private.tistory.com/144) (10) | 2022.12.06 |
| [파이썬으로 네이버 스마트스토어 커머스API 활용하기 - 인증 토큰 발급](https://private.tistory.com/141) (1) | 2022.11.25 |
| [파이썬으로 네이버 스마트스토어 커머스API 활용하기 - 애플리케이션아이디, 시크릿키 발급](https://private.tistory.com/140) (0) | 2022.11.25 |
| [파이썬 selenium chrome창이 갑자기 닫힐때](https://private.tistory.com/139) (2) | 2022.10.09 |

<audio xmlns="http://www.w3.org/1999/xhtml"></audio>