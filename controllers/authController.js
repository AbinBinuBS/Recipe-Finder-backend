export const authSuccess = async (req, res) => {
	if (!req.user) {
		return res.redirect("/auth/callback/failure");
	}
	try {
		const email = req.user.email;
		const name = req.user.displayName;
		const checkMailResponse = await axios.post(
			"https://recipe-finder-backend-idhn.onrender.com/api/checkMail",
			{ email, name }
		);

		if (checkMailResponse.data.emailExists) {
			const { accessToken, refreshToken } = checkMailResponse.data;
			return res.redirect(
				`https://recipe-finder-beige-three.vercel.app/home?accessToken=${accessToken}&refreshToken=${refreshToken}`
			);
		} else {
			const userName = req.user.displayName;
			const storeMail = await axios.post(
				"https://recipe-finder-backend-idhn.onrender.com/api/mentees/googleRegister",
				{ userName, password: "123456", email }
			);

			if (storeMail) {
				const { accessToken, refreshToken } = storeMail.data;
				return res.redirect(
					`https://recipe-finder-beige-three.vercel.app/?accessToken=${accessToken}&refreshToken=${refreshToken}`
				);
			}
		}
	} catch (error) {
		console.error("Error in checking mail for Google auth:", error.response ? error.response.data : error);
		res.redirect("/auth/callback/failure");
	}
};
