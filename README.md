# Full-NewWebSecurityLock
Projeto desenvolvido para o 4° semestre da faculdade inteiramente por mim, incluindo desenvolvimento de Arduino/ESP32 e APIs Web (Projeto Incompleto). 
*
Project developed for the 4th semester college fully by me, including Arduino/ESP32 development and Web APIs (Incomplete Project).

## Função | Function
O projeto tinha a ideia uma fechadura controlada por ESP32 atráves da internet, mais especificamente por um website com APIs de controle e segurança. Ele foi entregue em dezembro de 2024, infelizmente incompleto e não polido,mas com a grande maioria das partes funcionando, porém não de uma maneira satisfátoria, e com certas partes desnecessárias, mas feitas pelo meu interesse. 
*
The project had the idea of a lock controlled by a ESP32 through the internet, more specifically by a website with APIs for control and security. It was send in december of 2024, unfortunaly incompleted and unpolished, but with most parts working, although not in a satisfactory way, and with unnecessary parts, but they were made with my interest.

## NewWebSecurityLock
Essa é o Front-End/Parte principal do projeto, ele utiliza e conecta todas as APIs em algo utilizavel.
*
This is the Front-End/Main part of the project, it utilize and connect all the APIs into something usable.

## NewWebSLAccountAPI
Essa é a API para manuseio de contas, tendo a função de criar, modificar e verificar contas no Banco de Dados (BD) espécifico delas, que conta com um sistema de segurança uníco. 
*
This is the API for account handling, having the functions of creating, modifying and verifying accounts in their specific Database (DB), that count with a unique security system.

## NewWebSLControlAPI
Essa é a API que faz contato e controla o ESP32. 
*
This is the API that makes contact and control the ESP32.

## NewWebSLTokenAPI
A mais desnecessária API, mas é a que mais me orgulho, é um sistema de tokenização razoavelmente completo, conta com uma criação de Tokens de verifição único de uma segurança média, também tendo seu próprio verificação e uma com automatização de atualização de chaves de segurança controlada por tempo. 
*
The most unnecessary API, but the one that I am most proud, is a reasonably completed tokenization system, that has the creation of unique verification Token with an average security, it also has an own verification method and an automation for updating security keys that is controlled by time.
