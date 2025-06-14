import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Loading = ({ isLoading }) => {
	return (
		<>
			{isLoading && (
				<Skeleton
                    duration={0}
					style={{
						position: "fixed",
						top: 0,
						bottom: 0,
						left: 0,
						right: 0,
						backgroundColor: "rgba(0,0,0,0.1)",
						zIndex: 1000,
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						backdropFilter: "blur(4px)",
					}}
				/>
			)}
		</>
	);
};

export default Loading;
