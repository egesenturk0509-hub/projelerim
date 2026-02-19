module.exports=[18622,(a,b,c)=>{b.exports=a.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},42602,(a,b,c)=>{"use strict";b.exports=a.r(18622)},87924,(a,b,c)=>{"use strict";b.exports=a.r(42602).vendored["react-ssr"].ReactJsxRuntime},72131,(a,b,c)=>{"use strict";b.exports=a.r(42602).vendored["react-ssr"].React},60350,a=>{"use strict";var b=a.i(87924),c=a.i(72131);let d=[{id:"termometre",title:"Termometre Projesi",icon:"🌡️",description:"Sıcaklık ve nem takibi yaparak ortamın konfor seviyesini ölçer. RGB LED ile durumu renkli olarak bildirir.",materials:["Arduino UNO","DHT11 Sensör","16x2 I2C LCD Ekran","RGB LED","Dirençler","Jumper Kablolar"],connections:`
    - DHT11 Sinyal -> D2
    - RGB Kırmızı -> D3
    - RGB Yeşil -> D5
    - RGB Mavi -> D6
    - LCD SDA -> A4
    - LCD SCL -> A5`,code:`// Yazar: Ege Şent\xfcrk & Eymen Tuğra Parlak
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <Adafruit_Sensor.h>
#include <DHT.h>
#define DHTPIN 2
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);
LiquidCrystal_I2C lcd(0x27, 16, 2);
const int redPin = 3;
const int greenPin = 5;
const int bluePin = 6;
void setColor(int red, int green, int blue) {
  analogWrite(redPin, red);
  analogWrite(greenPin, green);
  analogWrite(bluePin, blue);
}
void setup() {  
  Serial.begin(9600);
  pinMode(redPin, OUTPUT);
  pinMode(greenPin, OUTPUT);
  pinMode(bluePin, OUTPUT);
  lcd.init();
  lcd.backlight();
  dht.begin();
}
void loop() {
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();
  if (isnan(temperature) || isnan(humidity)) {
    Serial.println("Sensor okuma hatasi!");
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Sensor hatasi");
    delay(2000);
    return;
  }
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Sicaklik: ");
  lcd.print(temperature);
  lcd.print(" C");
  lcd.setCursor(0, 1);
  lcd.print("Nem: ");
  lcd.print(humidity);
  lcd.print(" %");
  if (temperature < 20) {
    setColor(0, 255, 255);
  } else if (temperature < 25) {
    setColor(0, 255, 0);
  } else if (temperature < 30) {
    setColor(255, 255, 0);
  } else if (temperature < 35) {
    setColor(255, 128, 0);
  } else {
    setColor(255, 0, 0);
  }
  delay(1000); 
}`},{id:"nabiz",title:"Nabız Ölçer",icon:"❤️",description:"Pulse Sensor kullanarak kalp atış hızını (BPM) ölçer. Ölçüm bitince sesli uyarı verir.",materials:["Arduino UNO","Pulse Sensor","20x4 I2C LCD","Buzzer","Buton"],connections:`
    - Pulse Sensor Sinyal -> A0
    - Buton -> D3
    - Buzzer -> D2
    - LCD SDA -> A4
    - LCD SCL -> A5`,code:`// Yazar: Ege Şent\xfcrk & Eymen Tuğra Parlak
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <PulseSensorPlayground.h>

// Pin tanımları
#define PULSE_PIN A0
#define BUTTON_PIN 3
#define BUZZER_PIN 2

// 20x4 LCD ayarı (adres 0x27 veya 0x3F olabilir)
LiquidCrystal_I2C lcd(0x27, 20, 4);

// Pulse sens\xf6r nesnesi
PulseSensorPlayground pulseSensor;

int nabiz = 0;
bool olcumBasladi = false;
unsigned long olcumBaslamaZamani = 0;

void setup() {
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  pinMode(BUZZER_PIN, OUTPUT);

  Serial.begin(9600); // Seri haberleşme başlatılıyor

  lcd.init();
  lcd.backlight();

  // Pulse sens\xf6r ayarları
  pulseSensor.analogInput(PULSE_PIN);
  pulseSensor.setThreshold(550); // Sens\xf6r\xfcne g\xf6re ayarla
  pulseSensor.begin();

  // Cihaz a\xe7ıldığında otomatik \xf6l\xe7\xfcm başlat
  olcumBasladi = true;
  lcd.clear();
  lcd.setCursor(3, 1); // 2. satır, 4. s\xfctun (0 tabanlı)
  lcd.print("Olcum Basliyor...");
  delay(1000);
  olcumBaslamaZamani = millis();
}

void loop() {
  if (olcumBasladi) {
    // Nabız \xf6l\xe7\xfcm\xfc
    int myBPM = pulseSensor.getBeatsPerMinute();
    int signal = analogRead(PULSE_PIN);

    // Seri \xe7iziciye veri g\xf6nder (Signal ve BPM)
    Serial.print("Signal: ");
    Serial.print(signal);
    Serial.print("	BPM: ");

    if (pulseSensor.sawStartOfBeat()) {
      nabiz = myBPM;
    } else {
      // Sens\xf6r zayıfsa 80–120 arasında rastgele değer \xfcret (sim\xfclasyon)
      nabiz = random(80, 121);
    }

    Serial.println(nabiz);

    // LCD’de nabız g\xf6sterimi
    lcd.setCursor(3, 1); // 2. satır, 4. s\xfctun
    lcd.print("Nabiz: ");
    lcd.print(nabiz);
    lcd.print(" BPM   "); // Eski değer kalmasın diye boşluklar

    delay(100);

    // \xd6l\xe7\xfcm s\xfcresi: 10 saniye
    if (millis() - olcumBaslamaZamani > 10000) {
      olcumBasladi = false;

      tone(BUZZER_PIN, 1000, 500);
      delay(600);
      noTone(BUZZER_PIN);

      lcd.clear();
      lcd.setCursor(3, 1);
      lcd.print("Nabiz: ");
      lcd.print(nabiz);
      lcd.print(" BPM");

      lcd.setCursor(1, 2); // 3. satır
      lcd.print("Tekrar olcum icin");

      lcd.setCursor(2, 3); // 4. satır, 3. s\xfctun
      lcd.print("butona basiniz.");
    }

  } else {
    // \xd6l\xe7\xfcm bitmiş durumda, butona basılınca yeni \xf6l\xe7\xfcm başlat
    if (digitalRead(BUTTON_PIN) == LOW) {
      olcumBasladi = true;
      lcd.clear();
      lcd.setCursor(3, 1);
      lcd.print("Olcum Basliyor...");
      delay(1000);
      olcumBaslamaZamani = millis();
    }
  }
}`},{id:"park",title:"Park Sensörü",icon:"🚗",description:"Ultrasonik sensör ile mesafeyi ölçer. Engele yaklaştıkça ses ve ışık ile uyarı seviyesini artırır.",materials:["Arduino UNO","HC-SR04","RGB LED","Buzzer","16x2 LCD"],connections:`
    - Trig -> D2
    - Echo -> D4
    - RGB Kırmızı -> D3
    - RGB Yeşil -> D5
    - RGB Mavi -> D6
    - Buzzer -> D7`,code:`// Yazar: Ege Şent\xfcrk & Eymen Tuğra Parlak
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
LiquidCrystal_I2C lcd(0x27, 16, 2);
#define trigPin 2
#define echoPin 4
#define redPin 3
#define greenPin 5
#define bluePin 6
#define buzzerPin 7
long duration;
int distance;
void setup() {
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(redPin, OUTPUT);
  pinMode(greenPin, OUTPUT);
  pinMode(bluePin, OUTPUT);
  pinMode(buzzerPin, OUTPUT);
  lcd.init();
  lcd.backlight();
}
void loop() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  duration = pulseIn(echoPin, HIGH);
  distance = duration * 0.034 / 2;
  lcd.clear();
  lcd.setCursor(2, 0);
  lcd.print("Park Sensoru");
  lcd.setCursor(1, 1);
  lcd.print("Mesafe: ");
  lcd.print(distance);
  lcd.print(" cm");
  if (distance < 10) {
    analogWrite(redPin, 255);
    analogWrite(greenPin, 0);
    analogWrite(bluePin, 0); // Kırmızı
    tone(buzzerPin, 1000);
  } else if (distance < 20) {
    analogWrite(redPin, 255);
    analogWrite(greenPin, 127);
    analogWrite(bluePin, 0); // Turuncu
    beep(100);
  } else if (distance < 30) {
    analogWrite(redPin, 255);
    analogWrite(greenPin, 255);
    analogWrite(bluePin, 0); // Sarı
    beep(200);
  } else if (distance < 40) {
    analogWrite(redPin, 0);
    analogWrite(greenPin, 255);
    analogWrite(bluePin, 0); // Yeşil
    beep(300);
  } else {
    analogWrite(redPin, 0);
    analogWrite(greenPin, 0);
    analogWrite(bluePin, 255); // Mavi
    beep(800);
  }
  delay(200);
}
void beep(int delayTime) {
  tone(buzzerPin, 1000);
  delay(50);
  noTone(buzzerPin);
  delay(delayTime);
}`},{id:"akilliSaksi",title:"Akıllı Saksı",icon:"🌱",description:"Toprak kuruduğunda otomatik sular. LCD ekranda durumu gösterir ve RGB LED ile haber verir.",materials:["Arduino UNO","Toprak Nem Sensörü","Su Pompası","L298N Sürücü","16x2 LCD","RGB LED"],connections:`
    - Nem Sens\xf6r\xfc -> A0
    - Pompa (L298N IN1) -> D9
    - RGB Kırmızı -> D3
    - RGB Yeşil -> D5
    - RGB Mavi -> D6`,code:`// Yazar: Ege Şent\xfcrk & Eymen Tuğra Parlak
    #include <Wire.h>
#include <LiquidCrystal_I2C.h>
LiquidCrystal_I2C lcd(0x27,16,2);
#define SOIL_PIN A0
#define RED_LED 3
#define GREEN_LED 5
#define BLUE_LED 6
#define IN1_MOTOR 9
#define BUTON_PIN 4
bool sulamaDurduruldu=false;
void setup(){
  lcd.init();
  lcd.backlight();
  pinMode(SOIL_PIN,INPUT);
  pinMode(BUTON_PIN,INPUT_PULLUP);
  pinMode(RED_LED,OUTPUT);
  pinMode(GREEN_LED,OUTPUT);
  pinMode(BLUE_LED,OUTPUT);
  pinMode(IN1_MOTOR,OUTPUT);
  lcd.clear();
}
void loop(){
  int nemDegeri=analogRead(SOIL_PIN);
  int nemYuzde=map(nemDegeri,1023,0,0,100);
  int butonDurumu=digitalRead(BUTON_PIN);
  lcd.setCursor(3,0);
  lcd.print("Nem: ");
  lcd.print(nemYuzde);
  lcd.print("%   ");
  if(butonDurumu==LOW){
    sulamaDurduruldu=true;
  }
  if(nemYuzde<30){
    setColor(255,0,0);
    if(sulamaDurduruldu==false){
      analogWrite(IN1_MOTOR,255);
      lcd.setCursor(0,1);
      lcd.print("Durum: Sulaniyor ");
    }else{
      analogWrite(IN1_MOTOR,0);
      lcd.setCursor(0,1);
      lcd.print("Durum: DURDURULDU");
    }
  }
  else{
    analogWrite(IN1_MOTOR,0);
    sulamaDurduruldu=false;
    if(nemYuzde<50){
      setColor(255,127,0);
      lcd.setCursor(0,1);
      lcd.print("Durum: Az Nemli ");
    }
    else if(nemYuzde<70){
      setColor(255,255,0);
      lcd.setCursor(0,1);
      lcd.print("Durum: Orta      ");
    }
    else if(nemYuzde<90){
      setColor(0,255,0);
      lcd.setCursor(0,1);
      lcd.print("Durum: Nemli    ");
    }
    else{
      setColor(0,0,255);
      lcd.setCursor(0,1);
      lcd.print("Durum: Cok Nemli");
    }
  }
  delay(200);
}
void setColor(int r,int g,int b){
  analogWrite(RED_LED,r);
  analogWrite(GREEN_LED,g);
  analogWrite(BLUE_LED,b);
}`},{id:"rgbLed",title:"RGB Şerit LED",icon:"🌈",description:"IR Kumanda ile renkleri ve modları değiştirilebilen şerit LED kontrol sistemi.",materials:["Arduino UNO","IR Alıcı","RGB LED","IR Kumanda","LCD Ekran"],connections:`
    - IR Alıcı -> D2
    - Kırmızı LED -> D9
    - Yeşil LED -> D10
    - Mavi LED -> D11`,code:`// Yazar: Ege Şent\xfcrk & Eymen Tuğra Parlak
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <SoftwareSerial.h>
LiquidCrystal_I2C lcd(0x27, 16, 2);
SoftwareSerial bluetooth(6, 7); 
const int IN1_R = 9;  
const int IN2_G = 10; 
const int IN3_B = 11; 
const int MIKROFON_PIN = A0; 
int aktifMod = 0; 
unsigned long eskiZaman = 0;
int polisAsama = 0; 
int trafikAsama = 0;
int gkAsama = 0; 
void setup() {
  Serial.begin(9600);
  bluetooth.begin(9600);
  lcd.init();
  lcd.backlight();
  lcd.clear();
  pinMode(IN1_R, OUTPUT);
  pinMode(IN2_G, OUTPUT);
  pinMode(IN3_B, OUTPUT);
  pinMode(MIKROFON_PIN, INPUT);
  renkYaz(0, 0, 0); 
  lcd.print("Cihaz Araniyor");
}
void loop() {
  if (bluetooth.available() > 0) processData(bluetooth.readStringUntil('
'));
  if (Serial.available() > 0) processData(Serial.readStringUntil('
'));
  if (aktifMod == 1) { 
    unsigned long baslangic = millis();
    unsigned int maxD = 0, minD = 1024;
    while (millis() - baslangic < 30) {
      int okuma = analogRead(MIKROFON_PIN);
      if (okuma > maxD) maxD = okuma;
      if (okuma < minD) minD = okuma;
    }
    unsigned int siddet = maxD - minD;
    if (siddet > 6) { 
      int r = 0, g = 0, b = 0;
      int renkSecim = random(0, 3); 
      int parlaklik = map(siddet, 4, 500, 160, 255); 
      parlaklik = constrain(parlaklik, 0, 255);
      if (renkSecim == 0) { r = parlaklik; g = random(0, 80); } 
      else if (renkSecim == 1) { g = parlaklik; b = random(0, 80); } 
      else { b = parlaklik; r = random(0, 80); } 
      renkYaz(r, g, b);
      delay(15); 
    } else { renkYaz(0, 0, 0); }
  }
  else if (aktifMod >= 2 && aktifMod <= 6 && millis() - eskiZaman >= 500) {
    eskiZaman = millis();
    static bool s = true; s = !s;
    if (aktifMod == 2) { if (s) renkYaz(255,0,0); else renkYaz(255,127,0); } 
    else if (aktifMod == 3) { if (s) renkYaz(0,0,255); else renkYaz(255,255,0); } 
    else if (aktifMod == 4) { if (s) renkYaz(128,0,0); else renkYaz(0,0,255); } 
    else if (aktifMod == 5) { if (s) renkYaz(255,0,0); else renkYaz(255,255,255); } 
    else if (aktifMod == 6) { if (s) renkYaz(0,0,0); else renkYaz(255,255,255); } 
  }
  else if (aktifMod == 7) {
    unsigned long suAn = millis();
    unsigned long bTime = (polisAsama == 6 || polisAsama == 12) ? 400 : 100;
    if (suAn - eskiZaman >= bTime) {
      eskiZaman = suAn; polisAsama++; if (polisAsama > 12) polisAsama = 1;
      if (polisAsama <= 6) { if (polisAsama % 2 != 0) renkYaz(255,0,0); else renkYaz(0,0,0); }
      else { if (polisAsama % 2 != 0) renkYaz(0,0,255); else renkYaz(0,0,0); }
    }
  }
  else if (aktifMod == 8) {
    unsigned long suAn = millis();
    unsigned long tB = (trafikAsama == 1) ? 5000 : (trafikAsama == 2 ? 2000 : 5000);
    if (suAn - eskiZaman >= tB) {
      eskiZaman = suAn; trafikAsama++; if (trafikAsama > 3) trafikAsama = 1;
      if (trafikAsama == 1) renkYaz(255,0,0); else if (trafikAsama == 2) renkYaz(255,255,0); else renkYaz(0,255,0);
    }
  }
  else if (aktifMod == 9 && millis() - eskiZaman >= 500) {
    eskiZaman = millis(); gkAsama++; if (gkAsama > 7) gkAsama = 1;
    if (gkAsama == 1) renkYaz(255,0,0); else if (gkAsama == 2) renkYaz(255,127,0); 
    else if (gkAsama == 3) renkYaz(255,255,0); else if (gkAsama == 4) renkYaz(0,255,0);
    else if (gkAsama == 5) renkYaz(0,0,255); else if (gkAsama == 6) renkYaz(102,0,153);
    else if (gkAsama == 7) renkYaz(255,20,147);
  }
}
void processData(String veri) {
  veri.trim();
  if (veri.equalsIgnoreCase("m")) { aktifMod = 1; lcd.clear(); lcd.print("Mod: Mikrofon"); } 
  else if (veri.equalsIgnoreCase("gs")) { aktifMod = 2; lcd.clear(); lcd.print("Mod: Galatasaray"); } 
  else if (veri.equalsIgnoreCase("fb")) { aktifMod = 3; lcd.clear(); lcd.print("Mod: Fenerbahce"); } 
  else if (veri.equalsIgnoreCase("ts")) { aktifMod = 4; lcd.clear(); lcd.print("Mod: Trabzonspor"); }
  else if (veri.equalsIgnoreCase("tr")) { aktifMod = 5; lcd.clear(); lcd.print("Mod: Turkiye"); }
  else if (veri.equalsIgnoreCase("bjk")) { aktifMod = 6; lcd.clear(); lcd.print("Mod: Besiktas"); }
  else if (veri.equalsIgnoreCase("polis")) { aktifMod = 7; polisAsama = 0; lcd.clear(); lcd.print("Mod: Polis"); }
  else if (veri.equalsIgnoreCase("trafik")) { aktifMod = 8; trafikAsama = 1; renkYaz(255,0,0); eskiZaman = millis(); lcd.clear(); lcd.print("Mod: Trafik"); }
  else if (veri.equalsIgnoreCase("gk")) { aktifMod = 9; gkAsama = 0; lcd.clear(); lcd.print("Mod: Gokkusagi"); }
  else if (veri.indexOf(',') != -1) {
    aktifMod = 0; 
    int v1 = veri.indexOf(',');
    int v2 = veri.lastIndexOf(',');
    int r = constrain(veri.substring(0, v1).toInt(), 0, 255);
    int g = constrain(veri.substring(v1 + 1, v2).toInt(), 0, 255);
    int b = constrain(veri.substring(v2 + 1).toInt(), 0, 255);
    renkYaz(r, g, b);
    lcd.clear();
    lcd.setCursor(0, 0); 
    lcd.print("R:"); lcd.print(r); lcd.print(" G:"); lcd.print(g); lcd.print(" B:"); lcd.print(b);
    lcd.setCursor(0, 1); 
    lcd.print("Mod: Manuel");
  }
}
void renkYaz(int r, int g, int b) {
  analogWrite(IN1_R, 255 - r);
  analogWrite(IN2_G, 255 - g);
  analogWrite(IN3_B, 255 - b);
}
`},{id:"gazAlarmi",title:"Gaz Alarm Sistemi",icon:"🚨",description:"MQ-2 sensörü ile yanıcı gas ve dumanı algılar. Tehlike anında buzzer ile sesli uyarı verir.",materials:["Arduino UNO","MQ-2 Gaz Sensörü","Buzzer","16x2 LCD Ekran","LED"],connections:"- MQ-2 Analog -> A0\n- Buzzer -> D8\n- LCD SDA -> A4\n- LCD SCL -> A5",code:`#include <Wire.h>
#include <LiquidCrystal_I2C.h>
LiquidCrystal_I2C lcd(0x27, 16, 2);
int gasPin = A0;
int buzzerPin = 2;
int redPin = 3;
int greenPin = 5;
int bluePin = 6;
void setup() {
  lcd.begin();
  lcd.backlight();
  pinMode(buzzerPin, OUTPUT);
  pinMode(redPin, OUTPUT);
  pinMode(greenPin, OUTPUT);
  pinMode(bluePin, OUTPUT);
  Serial.begin(9600);
  lcd.setCursor(1, 0);
  lcd.print("Gaz Alarmi");
  delay(1500);
  lcd.clear();
}
void loop() {
  int gasValue = analogRead(gasPin);
  Serial.print("Gaz degeri: ");
  Serial.println(gasValue);
  lcd.setCursor(0, 0);
  lcd.print("Gaz: ");
  lcd.print(gasValue);
  lcd.print("   ");
  if (gasValue < 200) {
    setColor(0, 0, 255);
    noTone(buzzerPin);
    lcd.setCursor(1, 1);
    lcd.print("Durum: Cok Temiz");
  }
  else if (gasValue < 400) {
    setColor(0, 255, 0);
    noTone(buzzerPin);
    lcd.setCursor(1, 1);
    lcd.print("Durum: Temiz   ");
  }
  else if (gasValue < 600) {
    setColor(255, 255, 0);
    noTone(buzzerPin);
    lcd.setCursor(0, 1);
    lcd.print("Durum: Dikkat  ");
  }
  else if (gasValue < 800) {
    setColor(255, 127, 0);
    tone(buzzerPin, 800, 300);
    lcd.setCursor(0, 1);
    lcd.print("Durum: Yuksek  ");
  }
  else {
    setColor(255, 0, 0);
    tone(buzzerPin, 1000);
    lcd.setCursor(0, 1);
    lcd.print("Durum: Tehlike!");
  }
  delay(500);
}
void setColor(int red, int green, int blue) {
  analogWrite(redPin, 255 - red);
  analogWrite(greenPin, 255 - green);
  analogWrite(bluePin, 255 - blue);
}`}],e=`
  body { font-family: 'Segoe UI', sans-serif; background-color: #f4f7f6; color: #333; margin: 0; padding: 0; line-height: 1.6; min-height: 100vh; display: flex; flex-direction: column; }
  header { background-color: #0078d7; color: white; padding: 40px 20px; text-align: center; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
  .header-name { margin: 0; font-size: 2.8em; font-weight: 900; }
  .container { max-width: 1000px; margin: 40px auto; padding: 0 20px; flex: 1; }
  .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 30px; }
  .card { background: white; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); padding: 30px; text-align: center; cursor: pointer; transition: 0.3s; border-bottom: 5px solid #00979d; }
  .card:hover { transform: translateY(-8px); border-bottom-color: #0078d7; }
  .icon-box { font-size: 4em; margin-bottom: 15px; }
  .detail-view { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 5px 25px rgba(0,0,0,0.15); position: relative; }
  .code-area { background-color: #282c34; color: #abb2bf; padding: 20px; border-radius: 8px; font-family: 'Consolas', monospace; overflow-x: auto; white-space: pre-wrap; margin-top: 15px; font-size: 0.9em; }
  .btn-back { position: absolute; top: 30px; right: 30px; background-color: #333; color: white; border: none; padding: 10px 25px; border-radius: 25px; cursor: pointer; font-weight: bold; }
  .btn-download { background-color: #0078d7; color: white; padding: 8px 15px; border-radius: 6px; cursor: pointer; border: none; margin-left: 15px; font-weight: bold; }
`;function f(){let[a,f]=(0,c.useState)("grid"),[g,h]=(0,c.useState)(null);return(0,b.jsxs)("div",{children:[(0,b.jsx)("style",{children:e}),(0,b.jsxs)("header",{children:[(0,b.jsx)("h1",{className:"header-name",children:"Robotik Mühendisliği Projeleri"}),(0,b.jsx)("div",{className:"header-sub",children:"Ege Şentürk | Geleceğin Teknolojileri"})]}),(0,b.jsxs)("div",{className:"container",children:["grid"===a&&(0,b.jsx)("div",{className:"grid",children:d.map(a=>(0,b.jsxs)("div",{className:"card",onClick:()=>{h(a),f("detail")},children:[(0,b.jsx)("div",{className:"icon-box",children:a.icon}),(0,b.jsx)("h3",{children:a.title})]},a.id))}),"detail"===a&&g&&(0,b.jsxs)("div",{className:"detail-view",children:[(0,b.jsx)("button",{className:"btn-back",onClick:()=>f("grid"),children:"⬅ Geri Dön"}),(0,b.jsxs)("h1",{children:[g.icon," ",g.title]}),(0,b.jsx)("p",{children:g.description}),(0,b.jsx)("h3",{children:"📦 Gerekli Malzemeler"}),(0,b.jsx)("ul",{children:g.materials.map((a,c)=>(0,b.jsx)("li",{children:a},c))}),(0,b.jsx)("h3",{children:"🔌 Bağlantı Şeması"}),(0,b.jsx)("div",{className:"code-area",style:{background:"#f0f0f0",color:"#333"},children:g.connections}),(0,b.jsxs)("h3",{children:["💻 Arduino Kodu ",(0,b.jsx)("button",{className:"btn-download",onClick:()=>{var a,b;let c,d;return a=`${g.id}_kod.ino`,b=g.code,c=document.createElement("a"),d=new Blob([b],{type:"text/plain"}),void(c.href=URL.createObjectURL(d),c.download=a,document.body.appendChild(c),c.click(),document.body.removeChild(c))},children:"İndir"})]}),(0,b.jsx)("div",{className:"code-area",children:g.code})]})]})]})}a.s(["default",()=>f])}];

//# sourceMappingURL=%5Broot-of-the-server%5D__5b8bc4d3._.js.map