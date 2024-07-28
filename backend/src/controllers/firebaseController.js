const db = require('../firebaseConfig');

const getFirebaseData = (req, res) => {
  const ref = db.ref('fruit_quality');
  ref.once('value', (snapshot) => {
    const data = snapshot.val();
    const formattedData = Object.keys(data).map(key => ({
      id: data[key].id,
      sensorValue: data[key].sensorValue,
      voltage: data[key].voltage
    }));
    res.status(200).json(formattedData);
  }, (errorObject) => {
    console.log('The read failed: ' + errorObject.name);
    res.status(500).json({ error: 'The read failed: ' + errorObject.name });
  });
};

module.exports = {
  getFirebaseData
};
