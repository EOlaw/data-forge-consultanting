const Client = require('../models/clientModel');
const User = require('../models/userModel');

const clientControllers = {
    // Render form to create a new consultant profile
    renderCreateForm: async (req, res) => {
        res.render('client/createClient');
    },
    // Create a new client
    createClient: async (req, res) => {
        try {
            // Find user by userId
            const user = await User.findById(req.body.userId);
            if (!user) return res.status(404).render('error', { message: 'User not found' });
            // Check if user has the role of 'Client'
            if (user.role !== 'Client') return res.status(403).render({ error: 'Only users with the role of "Client" can create client profiles' });
            // Create a new client profile
            const client = new Client(req.body);
            await client.save();
            console.log('Client profile created:', client); // Log the created client
            res.redirect(`/client/${client._id}`)
        } catch (err) {
            console.error('Error creating client profile:', err); // Log the error
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
            console.log('Fetching client with ID:', req.params.id); // Log the client ID
            const client = await Client.findById(req.params.id).populate('userId');
            if (!client) {
                console.error('Client profile not found'); // Log if client is not found
                return res.status(404).json({ error: 'Client profile not found' });
            }
            console.log('Client profile found:', client); // Log the found client
            const user = await User.findById(client.userId);
            res.render('client/clientProfile', { client: { ...client._doc, user }});
            //res.json({ client })
        } catch (err) {
            console.error('Error fetching client profile:', err); // Log the error
            res.status(400).json({ error: err.message });
        }
    },
    // Render form to update a consultant profile by ID
    renderUpdateForm: async (req, res) => {
        try {
            const client = await Client.findById(req.params.id).populate('userId');
            if (!client) return res.status(404).render('error', { message: 'Consultant profile not found' });
            res.render('client/updateClient', { client });
        } catch (err) {
            res.status(400).render('error', { message: err.message });
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
