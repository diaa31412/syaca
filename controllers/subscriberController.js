// const Subscriber = require('../models/subscriberModel');


const db = require('../models/indexModel');
const Subscriber = db.Subscriber;
const Card = db.Card;




exports.subscribe = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id; // from auth middleware

    const exists = await Subscriber.findOne({ where: { userId, courseId } });
    if (exists) return res.status(400).json({ message: 'Already subscribed' });

    const subscription = await Subscriber.create({ userId, courseId });
    res.status(201).json(subscription);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserSubscriptions = async (req, res) => {
  try {
    const userId = req.user.id;
    const subscriptions = await Subscriber.findAll({ where: { userId } });
    res.json(subscriptions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }

}


exports.createSubscription = async (req, res) => {
  const transaction = await db.sequelize.transaction();
   
  try {
    const { courseId, card_number } = req.body;
    const userId = req.user.id;

    // 0. Check course status
    const course = await db.Course.findByPk(courseId);
    if (!course) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Course not found' });
    }

    // 1. Check if subscription already exists
    const existingSub = await Subscriber.findOne({
      where: { userId, courseId },
      transaction
    });
    if (existingSub) {
      await transaction.rollback();
      return res.status(400).json({ error: 'Already subscribed to this course' });
    }

    // 2. If course is free → skip card validation
    if (course.status === "free") {
      const subscription = await Subscriber.create({
        userId,
        courseId
      }, { transaction });

      await transaction.commit();
      return res.status(201).json(subscription);
    }

    // 3. For paid courses → verify card
    const card = await Card.findOne({ 
      where: { card_number: card_number },
      transaction
    });

    if (!card) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Card not found' });
    }

    if (!card.isActive) {
      await transaction.rollback();
      return res.status(400).json({ error: 'Card is not active' });
    }

    // 4. Deactivate the card
    await card.update({ isActive: false }, { transaction });

    // 5. Create subscription
    const subscription = await Subscriber.create({
      userId,
      courseId,
      cardId: card.id
    }, { transaction });

    await transaction.commit();
    res.status(201).json(subscription);

  } catch (err) {
    await transaction.rollback();
    console.log(err.message);
    res.status(500).json({ error: 'Subscription failed: ' + err.message });
  }
};


// exports.createSubscription = async (req, res) => {
//   const transaction = await db.sequelize.transaction();
   
//   try {
//     const { courseId, card_number } = req.body;
//     const userId = req.user.id;
 
//     // 1. Verify and lock card
//     const card = await Card.findOne({ 
//       where: { card_number: card_number },
//       transaction
//     });

//     if (!card) {
//       await transaction.rollback();
//       return res.status(404).json({ error: 'Card not found' });
//     }

//     if (!card.isActive) {
//       await transaction.rollback();
//       return res.status(400).json({ error: 'Card is not active' });
//     }

//     // 2. Check if subscription already exists
//     const existingSub = await Subscriber.findOne({
//       where: { userId, courseId },
//       transaction
//     });
    
//     if (existingSub) {
//       await transaction.rollback();
//       return res.status(400).json({ error: 'Already subscribed to this course' });
//     }
   
//     // 3. If course is free → skip card validation
//     if (course.status === "free") {
//       const subscription = await Subscriber.create({
//         userId,
//         courseId
//       }, { transaction });
//     // 3. Deactivate the card
//     await card.update({ isActive: false }, { transaction });

//     // 4. Create subscription
//     const subscription = await Subscriber.create({
//       userId,
//       courseId,
//     //  card_number 
//       cardId: card.id
//     }, { transaction });

//     await transaction.commit();
//     res.status(201).json(subscription);

//   } catch (err) {
//     await transaction.rollback();
//     console.log(err.message)
//     res.status(500).json({ error: 'Subscription failed: ' + err.message });
//   }
// }