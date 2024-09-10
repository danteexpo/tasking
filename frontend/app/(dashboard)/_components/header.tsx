"use client";

import useSWR from "swr";
import fetcher from "@/utils/fetcher";
import { User } from "@/types/types";

const Header = () => {
	const { data, error, isLoading } = useSWR<User>(
		`${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/me`,
		fetcher
	);

	if (error) {
		return <p>Error fetching data. Please try again later.</p>;
	}

	if (isLoading || !data) {
		return <p>Loading...</p>;
	}

	return <p>Welcome {data.name}!</p>;
};

export default Header;
