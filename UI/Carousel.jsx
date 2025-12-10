import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css';
import Image from 'next/image';

function UncontrolledExample() {

    const HeroItems = [
        {
            image: '/Hero_1.png',
            heading: 'Health insurance that actually works!',
            text: 'Quality health coverage for individuals, families, and businesses across Nigeria.'
        },
        {
            image: '/Hero_2.png',
            heading: 'Invest in Your Teams Health, Watch Your Business Thrive',
            text: 'Digital-first plans with nationwide coverage, telemedicine access, and support when you need it most.'
        },
        {
            image: '/Hero_3.png',
            heading: 'Health Coverage That Puts You and Your Family First',
            text: `Affordable plans with access to Nigeria's largest network of trusted hospitals and healthcare providers.`
        }
    ];
    
  return (
    <section>
      <Carousel>
        {HeroItems.map((item, index) => (
          <Carousel.Item key={index}>
            <div className="relative w-full h-[60vh] sm:h-[50vh]">
              <Image src={item.image} alt={`Slide ${index + 1}`} fill className="object-cover" priority />
            </div>
            <Carousel.Caption>
              <h3 className="text-black dark:text-white">{item.heading}</h3>
              <p className="text-black/80 dark:text-white/80">{item.text}</p>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
    </section>
  );
}

export default UncontrolledExample;