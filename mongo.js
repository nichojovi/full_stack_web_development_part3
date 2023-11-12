/* eslint-disable no-undef */
const mongoose = require('mongoose');

async function connectToMongoDB() {
  const mongoDBUrl = process.env.MONGODB_URI;
  mongoose.set('strictQuery', false);
  try {
    await mongoose.connect(mongoDBUrl);
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
}

const Schema = mongoose.Schema;
const personSchema = new Schema({
  name: { type: String, required: true },
  number: { type: Number, required: true }
});
const Person = mongoose.model('Person', personSchema);

async function main() {
  await connectToMongoDB();
  const args = process.argv;
  if (args.length < 3) {
    console.log('Please provide the password as an argument.');
    return;
  }
  if (args.length === 3) {
    const people = await Person.find({});
    console.log('Phonebook:');
    people.forEach(({ name, number }) => console.log(`${name} ${number}`));
  } else {
    const newPerson = new Person({ name: args[3], number: args[4] });
    const savedPerson = await newPerson.save();
    console.log(`Added ${savedPerson.name} with number ${savedPerson.number} to phonebook`);
  }
  mongoose.connection.close();
}

main();
