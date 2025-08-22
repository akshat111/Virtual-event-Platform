exports.sendEmail = async (to, subject, body) => new Promise(resolve => {
  setTimeout(() => {
    console.log(` Email sent to ${to}: ${subject}\n${body}`);
    resolve();
  }, 1000);
});
