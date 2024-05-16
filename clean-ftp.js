const ftp = require('basic-ftp');

const ftpConfig = {
    host: process.env.FTP_HOST,
    port: process.env.FTP_PORT,
    user: process.env.FTP_USER,
    password: process.env.FTP_PASS,
    secure: false
  };
  
  async function cleanFilesDAT() {
    const dateToday = new Date();
    const today = dateToday.getDate();
    const firstDay = 1;
  
    if (today === firstDay) {
      const ftpClient = new ftp();
      await ftpClient.connect(ftpConfig);
  
      const filesDAT = await ftpClient.list('*.dat');
  
      for (const file of filesDAT) {
        await ftpClient.delete(file.name);
        console.log(`Deleted file: ${file.name}`);
      }
  
      await ftpClient.close();
    } else {
      console.log('No es el primer día del mes. No se eliminan archivos.');
    }
  }
  
  cleanFilesDAT();