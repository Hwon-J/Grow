#include "DHT.h"
#define DHTTYPE DHT11 
#define DHTPIN A2 
DHT dht(DHTPIN, DHTTYPE);
//you need to change this value that you had recorded in the air
const int AirValue = 690; //600;   

//you need to change this value that you had recorded in the water
const int WaterValue = 280;//340;  
int CDS = A1;
int intervals = (AirValue - WaterValue)/3;   
int soilMoistureValue = 0;

void setup() {
  Serial.begin(9600); // open serial port, set the baud rate to 9600 bps
  dht.begin();
}

void loop() {
  soilMoistureValue = analogRead(A0);  //put Sensor insert into soil
  CDS = analogRead(Ai1);
  float h = dht.readHumdity();
  float t = dht.readTemperature();
  Serial.print(soilMoistureValue);
  Serial.print(' ');
  Serial.print(CDS);      
  Serial.print(' ');   // 시리얼 모니터에 조도 센서의 측정 값 출력
  Serial.print(h);
  Serial.print(' ');
  Serial.print(t);
  Serial.println();
  // if(soilMoistureValue > WaterValue && soilMoistureValue < (WaterValue + intervals)) {
  //   Serial.print("soilMoistureValue : ");
  //   Serial.print(soilMoistureValue);
  //   Serial.println("    Very Wet");
    
  // } else if(soilMoistureValue > (WaterValue + intervals) 
  //   && soilMoistureValue < (AirValue - intervals)){
  //   Serial.print("soilMoistureValue : ");
  //   Serial.print(soilMoistureValue);
  //   Serial.println("    Wet");
  
  // } else if(soilMoistureValue < AirValue 
  //   && soilMoistureValue > (AirValue - intervals)) {
  //   Serial.print("soilMoistureValue : ");
  //   Serial.print(soilMoistureValue);
  //   Serial.println("    Dry");
  // }
  
  delay(2000);
}