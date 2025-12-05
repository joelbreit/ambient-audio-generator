export const getColorLabel = (color) => {
	const labels = [
		"Dark Brown",
		"Brown",
		"Pink-Brown",
		"Pink",
		"Pink-White",
	];
	const index = Math.min(Math.floor(color / 10), 4);
	return labels[index];
};

