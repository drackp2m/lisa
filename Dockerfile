FROM python:3.10-slim AS whisper

WORKDIR /python-docker

COPY tools/whisper/requirements.txt requirements.txt
RUN apt-get update && apt-get install git -y
RUN pip3 install -r requirements.txt
RUN pip3 install git+https://github.com/openai/whisper.git
RUN apt-get install -y ffmpeg

COPY tools/whisper/ .

EXPOSE 5000

CMD python3 -m flask run --host=0.0.0.0



FROM node:18-alpine AS nx-deps

RUN apk add --no-cache sudo git vim zsh g++ gcc make python3

WORKDIR /usr/src/app

RUN adduser -u 501 -s /bin/zsh -D user \
&& addgroup user node \
&& addgroup user root \
&& echo "%root ALL=(ALL) NOPASSWD: ALL" > /etc/sudoers

RUN chown -R user.user /usr/src/app

USER user

RUN git config --global --add safe.directory /usr/src/app

COPY package.json yarn.lock* ./

RUN yarn install --frozen-lockfile

RUN git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ~/powerlevel10k \
&& echo 'source ~/powerlevel10k/powerlevel10k.zsh-theme' >>~/.zshrc



FROM nx-deps AS nx-dev

USER user

CMD yarn start
