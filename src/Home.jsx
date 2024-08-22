import React, { useState, useEffect } from "react";
import { auth, db } from "./firebase"; // Assuming you have Firebase configured here
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

// Importing components for different roles
import CustomerNavbar from "./components/CustomerNavbar1";
import Hero from "./components/Hero1";
import GridContainer from "./components/GridContainer";
import Footer1 from "./components/Footer1";

// import CustomerHero from "./components/CustomerHero";
// import WorkerHero from "./components/WorkerHero";

import WorkerNavbar from "./components/WorkerNavbar";
import WorkerFooter from "./components/WorkerFooter";
import WorkerResponse from "./components/WorkerResponse";




const Home = () => {
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserRole = async (uid) => {
            try {
                const customerDoc = await getDoc(doc(db, "customers", uid));
                const workerDoc = await getDoc(doc(db, "Workers", uid));

                if (customerDoc.exists()) {
                    return customerDoc.data().role;
                } else if (workerDoc.exists()) {
                    return workerDoc.data().role;
                } else {
                    console.error("No role found for the user.");
                    return null;
                }
            } catch (error) {
                console.error("Error fetching user role:", error);
                return null;
            }
        };

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const role = await fetchUserRole(user.uid);
                setUserRole(role);
            } else {
                setUserRole(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return <div>Loading...</div>; // Show a loading spinner or placeholder
    }

    if (!userRole) {
        return <a className='text-4xl justify-center text-center font-mono' href='/login'><div>Please log in to continue.</div></a>; // Or redirect to a login page
    }

    return (
        <div>
            {/* Conditional rendering based on the user's role */}
            {userRole === "customer" && (
                <>
                    <CustomerNavbar />
                    <Hero />
                    <GridContainer />
                    <Footer1 />
                </>
            )}

            {userRole === "worker" && (
                <>
                    <WorkerNavbar />
                    <Hero />
                    <WorkerResponse/>
                    <WorkerFooter />
                </>
            )}

            {/* You can add more conditions for other roles like admin if needed */}
        </div>
    );
};

export default Home;
