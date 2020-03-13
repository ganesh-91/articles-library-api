const axios = require('axios');

(async () => {
  try {
    const { data } = await axios.post('http://localhost:3000/api/auth/login', {
      email: 'harshal.khaire91@gmail.com',
      password: 'speedTriple@2022'
    });

    const { token } = data;

    console.log(token);

    const  res2  = await axios.get(
      'http://localhost:3000/api/article/mine',
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      },
    );

    console.log('res2',res2.data);
  } catch ({ response }) {
    console.log('response.data',response.data);
  }
})();
