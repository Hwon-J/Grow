import { useEffect, useRef, useState } from "react" 
import NavTop from "../../components/NavTop";
import {
  PaymentWidgetInstance,
  loadPaymentWidget,
  ANONYMOUS,
} from "@tosspayments/payment-widget-sdk" 
import { Container } from "react-bootstrap"
import { useLocation } from "react-router-dom";

const clientKey = "test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq" 
const customerKey = "u42JRcA1N4a-RZne5f-Al" 

export default function CheckoutPage() {
  const location = useLocation();
  const data = location.state;
  const selectedItems = data.selectedItems[0]
  const totalQuantity = data.totalQuantity
  const paymentWidgetRef = useRef<PaymentWidgetInstance | null>(null) 
  const paymentMethodsWidgetRef = useRef<ReturnType<
    PaymentWidgetInstance["renderPaymentMethods"]
  > | null>(null) 
  const [price, setPrice] = useState(data.totalPrice) 

  useEffect(() => {
    (async () => {
      // ------  결제위젯 초기화 ------
      // 비회원 결제에는 customerKey 대신 ANONYMOUS를 사용하세요.
      const paymentWidget = await loadPaymentWidget(clientKey, customerKey)  // 회원 결제
      // const paymentWidget = await loadPaymentWidget(clientKey, ANONYMOUS)  // 비회원 결제

      // ------  결제위젯 렌더링 ------
      // 결제수단 UI를 렌더링할 위치를 지정합니다. `#payment-method`와 같은 CSS 선택자와 결제 금액 객체를 추가하세요.
      // DOM이 생성된 이후에 렌더링 메서드를 호출하세요.
      // https://docs.tosspayments.com/reference/widget-sdk#renderpaymentmethods선택자-결제-금액-옵션
      const paymentMethodsWidget = paymentWidget.renderPaymentMethods(
        "#payment-widget",
        price
      ) 

      // ------  이용약관 렌더링 ------
      // 이용약관 UI를 렌더링할 위치를 지정합니다. `#agreement`와 같은 CSS 선택자를 추가하세요.
      // https://docs.tosspayments.com/reference/widget-sdk#renderagreement선택자
      paymentWidget.renderAgreement("#agreement") 

      paymentWidgetRef.current = paymentWidget 
      paymentMethodsWidgetRef.current = paymentMethodsWidget 
    })() 
  }, []) 

  useEffect(() => {
    const paymentMethodsWidget = paymentMethodsWidgetRef.current 

    if (paymentMethodsWidget == null) {
      return 
    }

    // ------ 금액 업데이트 ------
    // 새로운 결제 금액을 넣어주세요.
    // https://docs.tosspayments.com/reference/widget-sdk#updateamount결제-금액
    paymentMethodsWidget.updateAmount(
      price,
      paymentMethodsWidget.UPDATE_REASON.COUPON
    ) 
  }, [price]) 

  return (
    <div>
      <NavTop />
      <Container><br />
      <h1>주문서</h1>
      <span>{`${price.toLocaleString()}원`}</span>
      <div id="payment-widget" />
      <div id="agreement" />
      <button
        onClick={async () => {
          const paymentWidget = paymentWidgetRef.current 

          try {
            // ------ '결제하기' 버튼 누르면 결제창 띄우기 ------
            // 더 많은 결제 정보 파라미터는 결제위젯 SDK에서 확인하세요.
            // https://docs.tosspayments.com/reference/widget-sdk#requestpayment결제-정보
            await paymentWidget?.requestPayment({
              orderId: "MErRViFJCTNV-m9vziL7l",
              orderName: `${selectedItems}합 총${totalQuantity}개`,
              customerMobilePhone: "01084743449",
              // customerName: "김토스",
              // customerEmail: "customer123@gmail.com",
              successUrl: `${window.location.origin}/success`,
              failUrl: `${window.location.origin}/fail`,
            }) 
          } catch (error) {
            // 에러 처리하기
            console.error(error) 
          }
        }}
      >
        결제하기
      </button>
      </Container>
    </div>
  ) 
}