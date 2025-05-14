import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import { getServerSession } from "@/lib/auth";
import { formatDate } from "@/lib/utils";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import AddToCartButton from "@/components/cart/AddToCartButton";
import StatusIndicator from "@/components/ui/StatusIndicator";
import { ChevronLeft, MapPin, Award, Leaf, Clock, Star } from "lucide-react";

interface PageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  await dbConnect();
  
  try {
    const product = await Product.findById(params.id)
      .populate({
        path: 'farmer',
        select: 'name location.address',
      })
      .lean();
    
    if (!product) {
      return {
        title: 'Product Not Found - Agrikul',
      };
    }
    
    return {
      title: `${product.name} - Agrikul Marketplace`,
      description: product.description.substring(0, 160),
    };
  } catch (error) {
    return {
      title: 'Product - Agrikul Marketplace',
    };
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  await dbConnect();
  
  try {
    const product = await Product.findById(params.id)
      .populate({
        path: 'farmer',
        select: 'name location.address ratings',
      })
      .lean();
    
    if (!product) {
      notFound();
    }
    
    const session = await getServerSession();
    
    // Convert Mongoose document to regular object and add id
    const productData = {
      ...JSON.parse(JSON.stringify(product)),
      id: product._id.toString(),
    };
    
    // Extract product information
    const {
      name,
      description,
      category,
      subCategory,
      images,
      price,
      quantity,
      quality,
      harvest,
      location,
      farmer,
      status,
      ratings,
    } = productData;
    
    return (
      <div className="bg-dark-900 min-h-screen pb-16 animate-fadeIn">
        {/* Back Button */}
        <div className="container mx-auto px-4 py-6">
          <Link 
            href="/marketplace" 
            className="inline-flex items-center text-gray-300 hover:text-cyan-glow transition-colors duration-200"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            <span>Back to Marketplace</span>
          </Link>
        </div>
        
        <main className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Images */}
            <div className="space-y-4">
              <Card className="overflow-hidden h-[400px] relative hover:shadow-glow transition-shadow duration-300">
                {images && images.length > 0 ? (
                  <Image
                    src={images[0]}
                    alt={name}
                    fill
                    className="object-cover rounded-lg"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-dark-800 text-gray-400">
                    No image available
                  </div>
                )}
                
                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <StatusIndicator status={status} />
                </div>
              </Card>
              
              {/* Thumbnail Gallery */}
              {images && images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.slice(1, 5).map((img, idx) => (
                    <div key={idx} className="rounded-lg overflow-hidden h-20 shadow-neuro hover:shadow-glow transition-shadow duration-300">
                      <Image
                        src={img}
                        alt={`${name} - image ${idx + 2}`}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="mb-2 flex items-center">
                  <span className="text-sm text-cyan-glow">{category}</span>
                  {subCategory && (
                    <>
                      <span className="mx-2 text-gray-500">•</span>
                      <span className="text-sm text-gray-400">{subCategory}</span>
                    </>
                  )}
                </div>
                <h1 className="text-3xl font-bold gradient-text mb-2">{name}</h1>
                
                {/* Ratings */}
                <div className="flex items-center space-x-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.round(ratings.average)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-500'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-400">
                    {ratings.average.toFixed(1)} ({ratings.count} reviews)
                  </span>
                </div>
              </div>
              
              {/* Price Section */}
              <Card className="p-4 hover:shadow-glow transition-shadow duration-300">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-400 text-sm">Price</p>
                    <div className="flex items-baseline">
                      <span className="text-2xl font-bold text-white">
                        {price.currency} {price.amount.toFixed(2)}
                      </span>
                      <span className="text-gray-400 ml-1">/ {price.unit}</span>
                    </div>
                    {price.negotiable && (
                      <span className="text-xs text-green-400">Negotiable</span>
                    )}
                  </div>
                  
                  <div>
                    <p className="text-gray-400 text-sm">Available</p>
                    <p className="text-white">
                      {quantity.available} {quantity.unit}
                    </p>
                    <p className="text-xs text-gray-400">
                      Min. order: {quantity.minimum} {quantity.unit}
                    </p>
                  </div>
                </div>
              </Card>
              
              {/* Add to Cart */}
              <div className="neuro-inset p-5 rounded-lg">
                <AddToCartButton
                  product={{
                    id: productData.id,
                    name,
                    price,
                    image: images?.[0] || '',
                    farmerId: farmer._id.toString(),
                    farmerName: farmer.name,
                    minQuantity: quantity.minimum,
                    availableQuantity: quantity.available,
                  }}
                />
              </div>
              
              {/* Farmer Info */}
              <Card className="p-4 hover:shadow-glow transition-shadow duration-300">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 rounded-full bg-dark-700 flex items-center justify-center">
                    <span className="text-lg font-bold text-cyan-glow">
                      {farmer.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{farmer.name}</h3>
                    <div className="flex items-center text-gray-400 text-sm">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>{location.address}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <Link href={`/marketplace/farmer/${farmer._id}`}>
                    <Button variant="outline" className="w-full">
                      View Farmer Profile
                    </Button>
                  </Link>
                </div>
              </Card>
              
              {/* Quick Info */}
              <div className="grid grid-cols-2 gap-3">
                {quality.organic && (
                  <div className="flex items-center p-3 neuro-inset rounded-lg">
                    <Leaf className="h-5 w-5 text-green-400 mr-2" />
                    <span className="text-sm">Organic</span>
                  </div>
                )}
                
                {quality.grade && (
                  <div className="flex items-center p-3 neuro-inset rounded-lg">
                    <Award className="h-5 w-5 text-yellow-400 mr-2" />
                    <span className="text-sm">Grade: {quality.grade}</span>
                  </div>
                )}
                
                {harvest.date && (
                  <div className="flex items-center p-3 neuro-inset rounded-lg">
                    <Clock className="h-5 w-5 text-cyan-glow mr-2" />
                    <span className="text-sm">Harvested: {formatDate(new Date(harvest.date))}</span>
                  </div>
                )}
                
                {harvest.season && (
                  <div className="flex items-center p-3 neuro-inset rounded-lg">
                    <Clock className="h-5 w-5 text-magenta-glow mr-2" />
                    <span className="text-sm">Season: {harvest.season}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Description Section */}
          <div className="mt-12">
            <Card className="p-6 hover:shadow-glow transition-shadow duration-300">
              <h2 className="text-xl font-semibold mb-4 gradient-text">Product Description</h2>
              <div className="prose prose-dark max-w-none">
                <p className="text-gray-300 whitespace-pre-line">{description}</p>
              </div>
              
              {/* Certifications */}
              {quality.certification && quality.certification.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2 text-cyan-glow">Certifications</h3>
                  <div className="flex flex-wrap gap-2">
                    {quality.certification.map((cert, idx) => (
                      <span 
                        key={idx} 
                        className="px-3 py-1 bg-dark-800 rounded-full text-xs text-gray-300 border border-dark-700"
                      >
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </div>
          
          {/* Related Products Section - TBD */}
        </main>
      </div>
    );
  } catch (error) {
    return (
      <div className="bg-dark-900 min-h-screen flex items-center justify-center">
        <Card className="p-8 max-w-md w-full text-center hover:shadow-glow transition-shadow duration-300">
          <h1 className="text-xl font-bold text-white mb-4">Error Loading Product</h1>
          <p className="text-gray-400 mb-6">We encountered an error while loading this product.</p>
          <Link href="/marketplace">
            <Button variant="primary" className="w-full">
              Return to Marketplace
            </Button>
          </Link>
        </Card>
      </div>
    );
  }
} 