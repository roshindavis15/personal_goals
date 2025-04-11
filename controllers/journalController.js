// Search journals
exports.searchJournals = async (req, res) => {
    try {
      const { keyword, startDate, endDate } = req.query;
      let query = { user: req.user._id };
      
      // Date filtering
      if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = new Date(startDate);
        if (endDate) query.createdAt.$lte = new Date(endDate);
      }
      
      let journals;
      
      // Keyword search
      if (keyword) {
        journals = await Journal.fuzzySearch(keyword)
          .where('user').equals(req.user._id)
          .populate('goal');
      } else {
        journals = await Journal.find(query).populate('goal');
      }
      
      res.render('journals/index', { 
        journals,
        searchQuery: { keyword, startDate, endDate }
      });
    } catch (err) {
      console.error(err);
      req.flash('error', 'Error searching journals');
      res.redirect('/journals');
    }
  };