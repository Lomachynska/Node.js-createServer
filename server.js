const http = require('http');
const fs = require('fs');
const path = 'user.txt';

// Создание пустого файла при запуске сервера
fs.writeFileSync(path, '', { flag: 'w' });

const server = http.createServer((req, res) => {
    if (req.method === 'GET') {
        // Читаем и отправляем содержимое user.txt
        fs.readFile(path, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                return res.end('Ошибка при чтении файла');
            }
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(data);
        });
    } else if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk;
        });
        req.on('end', () => {
            // Добавляем полученные данные в user.txt
            fs.appendFile(path, body + '\n', err => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    return res.end('Ошибка при записи в файл');
                }
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end('Данные добавлены');
            });
        });
    } else {
        res.writeHead(405, { 'Content-Type': 'text/plain' });
        res.end('Метод не поддерживается');
    }
});

// Запуск сервера на порту 8080
server.listen(8080, () => {
    console.log('Сервер запущен на порту 8080');
});
