const Client = require('../models/clientModel');
const User = require('../models/userModel');

const clientControllers = {
    // Create a new client
    createClient: async (req, res) => {
        try {
            // Extract userId from request body
            const { userId } = req.body;

            // Find user by userId
            const user = await User.findById(userId);
            if (!user) return res.status(404).json({ error: 'User not found' });
            // Check if user has the role of 'Client'
            if (user.role !== 'Client') return res.status(403).json({ error: 'Only users with the role of "Client" can create client profiles' });

            // Create a new client profile
            const client = new Client(req.body);
            await client.save();
            res.status(201).json(client);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },
    // Get all clients
    getClients: async (req, res) => {
        try {
            // Find all clients and populate the 'userId' field with user details
            const clients = await Client.find().populate('userId');
            res.status(200).json(clients);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },
    // Get a client by ID
    getClient: async (req, res) => {
        try {
            // Find client by ID and populate the 'userId' field with user details
            const client = await Client.findById(req.params.id).populate('userId');
            if (!client) {
                return res.status(404).json({ error: 'Client not found' });
            }
            res.status(200).json(client);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },
    // Update a client by ID
    updateClient: async (req, res) => {
        try {
            // Update client by ID
            const client = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
            if (!client) {
                return res.status(404).json({ error: 'Client not found' });
            }
            res.status(200).json(client);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },
    // Delete a client by ID
    deleteClient: async (req, res) => {
        try {
            // Delete client by ID
            const client = await Client.findByIdAndDelete(req.params.id);
            if (!client) {
                return res.status(404).json({ error: 'Client not found' });
            }
            res.status(200).json({ message: 'Client deleted' });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
};

module.exports = clientControllers;
