 
# Usa l'immagine di .NET Core SDK
FROM mcr.microsoft.com/dotnet/sdk:7.0.202

 
# Installa dipendenze
RUN apt-get update
RUN apt-get install -y git 
RUN apt-get install -y nano  
RUN apt-get install -y openssh-server
RUN apt-get install -y curl
#RUN apt-get install -y npm

 
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash - && \
    apt-get install -y nodejs

RUN npm install -g @angular/cli@9.1.14

# Configura ssh
RUN  mkdir /var/run/sshd
RUN echo 'root:password' | chpasswd
RUN echo 'PermitRootLogin yes' >>  /etc/ssh/sshd_config
 

# Esporre la porta SSH
EXPOSE 22
 
# Avvia il server SSH e il terminale bash al momento dell'avvio del container
CMD ["/usr/sbin/sshd", "-D"]
