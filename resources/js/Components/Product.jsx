import { Card } from "antd";

const { Meta } = Card;

const Product = ({ product }) => {
    const { image_url, name, description } = product;
    return (
        <Card
            hoverable
            className="h-full"
            cover={
                <img
                    alt={name}
                    src={
                        image_url ??
                        "https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                    }
                />
            }
        >
            <Meta
                title={name ?? "Europe Street beat"}
                description={description ?? "www.instagram.com"}
            />
             <Meta
                title={ `product owner: ${product.user.name}` ?? "No have owner"} 
            />

        </Card>
    );
};

export default Product;
