# Code Swap

Collaboration is a crucial skill in development, but students have few chances to write code together and receive feedback on their code's understandability and readability. Our solution is to create a fun, game-like experience where code understandability is the key to winning.

Teams of two go head-to-head, competing to solve a simple coding problem the quickest. After 60 seconds, code editors are switched around such that each team must build on the opposite team's work. The game ends when a team passes all test cases.

Code Swap is intended for college students, but anyone who is interested in a fun challenge is welcome to play. By mixing in some concepts from a core programming course (_COMPSCI 220 Programming Methodology_), users leave with a better understanding of the core concepts regarding readable code and increased comprehension of class material.

This application was built as a semester-long group project for the course _COMPSCI 426 Scalable Web Systems_ at UMass Amherst.

## Repository Setup

🧑‍💻 Clone the project

```
git clone https://github.com/Yonava/code-swap.git
```

👉 TP into the project

```
cd code-swap
```

🤫 Add environment secrets

```
touch .env && echo -e "REDIS_USERNAME=default\nREDIS_PASSWORD=🔒 Your Special Secret 🔒\nREDIS_HOST=🌐 Your Very Own Host 🌐\nREDIS_PORT=🔢 Your Magic Port 🔢" > .env
```

🎁 Gift all microservices the secrets

```
chmod +x setup-env.sh && ./setup-env.sh
```

🔪 Kill local processes on reserved ports

```
chmod +x kill-ports.sh && ./kill-ports.sh
```

🤠 Install dependencies

```
pnpm i
```


## Run Locally With Concurrently

```
pnpm dev
```

## Run With Docker Compose

```
docker compose up --build
```


## Team Code Swap

- [Ashley Bhandari (ashleybhandari)](https://github.com/ashleybhandari)
- [Wanqi Li (wLMEB)](https://github.com/wLMEB)
- [Viral Rathod (viralrathod10)](https://github.com/viralrathod10)
- [Yona Voss-Andreae (yonava)](https://github.com/yonava)
