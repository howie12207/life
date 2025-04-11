self.addEventListener('push', function (event) {
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: data.icon || '/default-icon.png',
    data: data.data,
  };
  const promiseChain = self.registration
    .showNotification(data.title, options)
    .then(() => {
      // console.log('push success');
    })
    .catch(() => {
      // console.log('push fail');
    });
  event.waitUntil(promiseChain);
});
