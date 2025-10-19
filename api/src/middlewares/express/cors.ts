import { CorsOptions } from "cors";
import { client_url } from "../../config/config";

const corsOptions: CorsOptions = {
    origin: client_url,
    credentials: true,
};

export default corsOptions;
