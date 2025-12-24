import React from "react";
import { Phone, MapPin, Clock } from "lucide-react";
import styles from "./StoresSection.module.css";

const StoresSection = () => {
  const stores = [
    {
      name: "Main Branch",
      location: "Boring Road, Patna",
      hours: "7AM-11PM",
      phone: "+91 1234567890",
      status: "Open Now",
    },
    {
      name: "Kankarbagh",
      location: "Kankarbagh Colony",
      hours: "7AM-11PM",
      phone: "+91 1234567891",
      status: "Open Now",
    },
    {
      name: "Rajendra Nagar",
      location: "Near Golambar",
      hours: "7AM-11PM",
      phone: "+91 1234567892",
      status: "Open Now",
    },
    {
      name: "Bihar Museum",
      location: "Bailey Road",
      hours: "8AM-10PM",
      phone: "+91 1234567893",
      status: "Open Now",
    },
  ];

  const handleCall = (phoneNumber: string) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  const handleDirections = (storeName: string) => {
    // In a real app, this would open Google Maps
    alert(`Opening directions to ${storeName}`);
  };

  return (
    <section className="section">
      <div className="container">
        <div className={styles.sectionHeader}>
          <h2 className="text-center">Visit Our Stores</h2>
          <p className="lead text-center">
            Find us across Patna for your sweet cravings
          </p>
        </div>

        <div className={styles.storesGrid}>
          {stores.map((store, index) => (
            <div key={index} className={`card ${styles.storeCard}`}>
              <div className={styles.storeHeader}>
                <div>
                  <h3 className={styles.storeName}>{store.name}</h3>
                  <span className={styles.storeStatus}>
                    <span className={styles.statusDot}></span>
                    {store.status}
                  </span>
                </div>
                <div className={styles.storeRating}>
                  <span>⭐ 4.8</span>
                </div>
              </div>

              <div className={styles.storeBody}>
                <div className={styles.storeInfo}>
                  <MapPin className={styles.infoIcon} size={16} />
                  <p className={styles.storeLocation}>{store.location}</p>
                </div>

                <div className={styles.storeInfo}>
                  <Clock className={styles.infoIcon} size={16} />
                  <p className={styles.storeHours}>Timings: {store.hours}</p>
                </div>

                <div className={styles.storeInfo}>
                  <Phone className={styles.infoIcon} size={16} />
                  <p className={styles.storePhone}>{store.phone}</p>
                </div>

                <div className={styles.storeActions}>
                  <button
                    className={`btn btn-sm btn-outline ${styles.actionButton}`}
                    onClick={() => handleDirections(store.name)}
                  >
                    <MapPin size={14} />
                    Directions
                  </button>
                  <button
                    className={`btn btn-sm btn-primary ${styles.actionButton}`}
                    onClick={() => handleCall(store.phone)}
                  >
                    <Phone size={14} />
                    Call Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StoresSection;
