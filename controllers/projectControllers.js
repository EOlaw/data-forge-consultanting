const Project = require('../models/projectModel')

const projectControllers = {
    // Create a new project
    createProject: async (req, res) => {
        try {
            const project = new Project(req.body);
            await project.save();
            res.status(201).json(project);
        } catch (error) {
            res.status(400).json(error);
        }
    },
    // Get all projects
    getProjects: async (req, res) => {
        try {
            const project = await Project.find().populate('clientID').populate('consultantID');
            res.status(200).json(project);
        } catch (error) {
            res.status(400).json(error);
        }
    },
    // Get a project by ID
    getProject: async (req, res) => {
        try {
            const project = await Project.findById(req.params.id).populate('clientID').populate('consultantID');
            if (!project) return res.status(404).json('Project not found');
            res.status(200).json(project);
        } catch (error) {
            res.status(400).json(error);
        }
    },
    // Update a project by ID
    updateProject: async (req, res) => {
        try {
            const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
            if (!project) return res.status(404).json('Project not found');
            res.status(200).json(project);
        } catch (error) {
            res.status(400).json(error);
        }
    },
    // Delete a project by ID
    deleteProject: async (req, res) => {
        try {
            const project = await Project.findByIdAndDelete(req.params.id);
            if (!project) return res.status(404).json('Project not found');
            res.status(200).json('Project deleted');
        } catch (error) {
            res.status(400).json(error);
        }
    }
}

module.exports = projectControllers