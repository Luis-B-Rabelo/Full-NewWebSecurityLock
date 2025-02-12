#include <WiFi.h>
#include <HTTPClient.h>
#include <ESP32Servo.h>

const uint ID = 1;

const char* SSID = "";

const char* PASSWORD = "";

String state_url = "http://{IPV4}:3002/state";

String action_url = "http://{IPV4}:3002/action";

static const int SERVO_PIN = 13;

static const int REED_PIN = 23;

Servo servo;

int servo_pos_deg = 0;

bool state = false;

void setup() 
{
  Serial.begin(921600);

  servo.attach(SERVO_PIN);
  pinMode(REED_PIN, INPUT_PULLUP);

  Serial.println("Connecting to: ");
  Serial.println(SSID);

  WiFi.begin(SSID, PASSWORD);

  while(WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.print("Connected to WiFi network with IP Address: ");
  Serial.println(WiFi.localIP());

  servo.write(++servo_pos_deg);
  
}

void loop() 
{
  bool reed = false;

  if(digitalRead(REED_PIN) == LOW)
  {
    reed = true;
  }
  else
  {
    reed = false;
  }

  if(WiFi.status() == WL_CONNECTED)
  {
    if(reed != state)
    {
      WiFiClient client;
      HTTPClient http;

      http.begin(client, state_url);

      http.addHeader("Content-Type", "application/x-www-form-urlencoded");

      String req = "lock_id=" + String(ID)+ "&state=" + String(reed);

      int http_response_code = http.POST(req);

      Serial.print("State Response: ");
      Serial.println(http_response_code);

      http.end();

      if(http_response_code == 200)
      {
        state = reed;
      }
    }

    if(state == true)
    {
      WiFiClient client;
      HTTPClient http;

      http.begin(client, action_url);

      http.addHeader("Content-Type", "application/x-www-form-urlencoded");

      String req = "lock_id=" + String(ID);

      int http_response_code = http.POST(req);

      Serial.print("Action Response: ");
      Serial.println(http_response_code);

      http.end();

      if(http_response_code == 200)
      {
        if(servo_pos_deg == 1)
        {
          while(servo_pos_deg < 90)
          {
            servo.write(++servo_pos_deg);
            delay(10);
          }
        }
        else
        {
          while(servo_pos_deg > 1)
          {
            servo.write(--servo_pos_deg);
            delay(10);
          }
        }
      }

      delay(3000);
    }
  }
  else
  {
    Serial.println("WiFi Disconnected");
  }
  
  delay(2000);
}
