import Exhibit from '../models/Exhibit.js'

export const getExhibitByNumber = async (req, res) => {
  try {
    const exhibit = await Exhibit.findOne({
      exhibitNumber: Number(req.params.number),
      isPublished: true,
    })

    if (!exhibit) {
      return res.status(404).json({ message: 'Exhibit not found' })
    }

    res.json(exhibit)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getAllPublishedExhibits = async (req, res) => {
  try {
    const exhibits = await Exhibit.find({ isPublished: true })
      .select('exhibitNumber title order')
      .sort({ order: 1, exhibitNumber: 1 })

    res.json(exhibits)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
