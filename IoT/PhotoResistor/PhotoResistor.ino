int CDS = A1;   // 조도 센서 모듈 연결한 핀
 
void setup() {
  Serial.begin(9600);
  pinMode(CDS, INPUT);  // 조도 센서를 입력 핀으로 설정
}
 
void loop() {
  CDS = analogRead(A1);    // 조도 센서의 측정 값을 val에 저장
  Serial.print("CDS_Sensor: ");
  Serial.println(CDS);         // 시리얼 모니터에 조도 센서의 측정 값 출력
 
  
 
  delay(200);                   // 0.2초 쉬고 반복(1000ms = 1s)
}