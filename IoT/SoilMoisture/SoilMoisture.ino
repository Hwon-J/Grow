//you need to change this value that you had recorded in the air
const int AirValue = 703; //600;   

//you need to change this value that you had recorded in the water
const int WaterValue = 284;//340;  

int intervals = (AirValue - WaterValue)/3;   
int soilMoistureValue = 0;

void setup() {
  Serial.begin(9600); // open serial port, set the baud rate to 9600 bps
}

void loop() {
  soilMoistureValue = analogRead(A0);  //put Sensor insert into soil

  Serial.print("soilMoistureValue : ");
  Serial.println(soilMoistureValue);
  
  if(soilMoistureValue > WaterValue && soilMoistureValue < (WaterValue + intervals)) {
    Serial.print("soilMoistureValue : ");
    Serial.print(soilMoistureValue);
    Serial.println("    Very Wet");
    
  } else if(soilMoistureValue > (WaterValue + intervals) 
    && soilMoistureValue < (AirValue - intervals)){
    Serial.print("soilMoistureValue : ");
    Serial.print(soilMoistureValue);
    Serial.println("    Wet");
  
  } else if(soilMoistureValue < AirValue 
    && soilMoistureValue > (AirValue - intervals)) {
    Serial.print("soilMoistureValue : ");
    Serial.print(soilMoistureValue);
    Serial.println("    Dry");
  }
  
  delay(500);
}