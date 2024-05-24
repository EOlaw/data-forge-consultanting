const Client = require('../models/clientModel');
const User = require('../models/userModel'); // Make sure to require the User model

const clientControllers = {
    // Create a new client
    createClient: async (req, res) => {
        try {
            const user = await User.findById(req.body.userID);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            if (user.role !== 'Client') {
                return res.status(403).json({ error: 'Only users with the role of "Client" can create client profiles' });
            }
            const client = new Client(req.body);
            await client.save();
            res.status(201).json(client);
        } catch (err) {
            res.status(400).json(err);
        }
    },
    // Get all clients
    getClients: async (req, res) => {
        try {
            const clients = await Client.find().populate('userID');
            res.status(200).json(clients);
        } catch (err) {
            res.status(400).json(err);
        }
    },
    // Get a client by ID
    getClient: async (req, res) => {
        try {
            const client = await Client.findById(req.params.id).populate('userID');
            if (!client) return res.status(404).json('Client not found');
            res.status(200).json(client);
        } catch (err) {
            res.status(400).json(err);
        }
    },
    // Update a client by ID
    updateClient: async (req, res) => {
        try {
            const client = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
            if (!client) return res.status(404).json('Client not found');
            res.status(200).json(client);
        } catch (error) {
            res.status(400).json(error);
        }
    },
    // Delete a client by ID
    deleteClient: async (req, res) => {
        try {
            const client = await Client.findByIdAndDelete(req.params.id);
            if (!client) return res.status(404).json('Client not found');
            res.status(200).json('Client deleted');
        } catch (error) {
            res.status(400).json(error);
        }
    }
};

module.exports = clientControllers;
