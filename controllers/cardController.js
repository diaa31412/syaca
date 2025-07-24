const Card = require('../models/cardModel');

// GET all cards
exports.getAllCards = async (req, res) => {
  try {
    const cards = await Card.findAll();
    res.json(cards);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve cards' });
  }
};

// GET card by ID
exports.getCardById = async (req, res) => {
  try {
    const card = await Card.findByPk(req.params.id);
    if (!card) return res.status(404).json({ error: 'Card not found' });
    res.json(card);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve card' });
  }
};

// GET card by card number
exports.getCardByNumber = async (req, res) => {
  try {
    const card = await Card.findOne({ where: { card_number: req.params.cardNumber } });
    if (!card) return res.status(404).json({ error: 'Card not found' });
    res.json(card);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve card' });
  }
};

// CREATE card (Admin only)
exports.createCard = async (req, res) => {
  try {
    const { card_number, isActive } = req.body;
    const card = await Card.create({ card_number, isActive });
    res.status(201).json(card);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create card: ' + err.message });
  }
};

// UPDATE card status (Admin only)
exports.updateCardStatus = async (req, res) => {
  try {
    const { isActive } = req.body;
    const card = await Card.findByPk(req.params.id);
    if (!card) return res.status(404).json({ error: 'Card not found' });

    card.isActive = isActive;
    await card.save();

    res.json(card);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update card status' });
  }
};

// DELETE card (Admin only)
exports.deleteCard = async (req, res) => {
  try {
    const card = await Card.findByPk(req.params.id);
    if (!card) return res.status(404).json({ error: 'Card not found' });

    await card.destroy();
    res.json({ message: 'Card deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete card' });
  }

  
};

exports.deactivateCard = async (req, res) => {
  try {
    const card = await Card.findOne({ 
      where: { card_number: req.params.cardNumber } 
    });
    
    if (!card) {
      return res.status(404).json({ error: 'Card not found' });
    }

    if (!card.isActive) {
      return res.status(400).json({ error: 'Card is already inactive' });
    }

    card.isActive = false;
    await card.save();

    res.json({ 
      message: 'Card deactivated successfully',
      card 
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to deactivate card: ' + err.message });
  }
};