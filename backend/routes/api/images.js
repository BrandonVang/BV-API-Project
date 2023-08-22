const { multipleFilesUpload, multipleMulterUpload, retrievePrivateFile } = require("../../awsS3");

router.get(
    '/:userId',
    async (req, res) => {
        const images = await Image.findAll({ where: { userId: req.params["userId"] } });
        const imageUrls = images.map(image => retrievePrivateFile(image.key));
        return res.json(imageUrls);
    }
);

router.post(
    '/:userId',
    multipleMulterUpload("images"),
    async (req, res) => {
        const { userId } = req.params;
        const keys = await multipleFilesUpload({ files: req.files });
        const images = await Promise.all(
            keys.map(key => Image.create({ key, userId }))
        );
        const imageUrls = images.map(image => retrievePrivateFile(image.key));
        return res.json(imageUrls);
    }
);
