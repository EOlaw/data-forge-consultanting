const Service = require('../models/serviceModel')

const serviceControllers = {
    // Create a new service
    createService: async (req, res) => {
        try {
            const service = new Service(req.body);
            await service.save();
            res.status(201).json(service);
        } catch (error) {
            res.status(400).json(error);
        }
    },
    // Get all services
    getServices: async (req, res) => {
        try {
            const service = await Service.find();
            res.status(200).json(service);
        } catch (error) {
            res.status(400).json(error);
        }
    },
    // Get a service by ID
    getService: async (req, res) => {
        try {
            const service = await Service.findById(req.params.id);
            if (!service) return res.status(404).json('Service not found');
            res.status(200).json(service);
        } catch (error) {
            res.status(400).json(error);
        }
    },
    // Update a service by ID
    updateService: async (req, res) => {
        try {
            const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
            if (!service) return res.status(404).json('Service not found');
            res.status(200).json(service);
        } catch (error) {
            res.status(400).json(error);
        }
    },
    // Delete a service by ID
    deleteService: async (req, res) => {
        try {
            const service = await Service.findByIdAndDelete(req.params.id);
            if (!service) return res.status(404).json('Service not found');
            res.status(200).json('Service deleted');
        } catch (error) {
            res.status(400).json(error);
        }
    }
}

module.exports = serviceControllers