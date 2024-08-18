import React, { useState, useEffect } from "react";
import { auth, db } from "./firebase"; // Assuming you have Firebase configured here
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

import CustomerNavbar from "./components/CustomerNavbar1";
import WorkerNavbar from "./components/WorkerNavbar";
// import CustomerHero from "./components/CustomerHero";
// import WorkerHero from "./components/WorkerHero";
import GridContainer from "./components/GridContainer";
import Footer1 from "./components/Footer1";
import WorkerFooter from "./components/WorkerFooter";
import Hero from "./components/Hero1";

const Home = () => {
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserRole = async (uid) => {
            try {
                const customerDoc = await getDoc(doc(db, "customers", uid));
                const workerDoc = await getDoc(doc(db, "workers", uid));

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

        const handleAuthStateChange = async (user) => {
            if (user) {
                const role = await fetchUserRole(user.uid);
                setUserRole(role);
                setLoading(false);

                if (role === "customer") {
                    navigate("/customer-home");
                } else if (role === "worker") {
                    navigate("/worker-home");
                }
            } else {
                setUserRole(null);
                setLoading(false);
            }
        };

        const unsubscribe = onAuthStateChanged(auth, handleAuthStateChange);

        return () => unsubscribe();
    }, [navigate]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!userRole) {
        return <div>Please sign in to continue.</div>;
    }

    return (
        <div>
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
                    <WorkerHero />
                    <WorkerFooter />
                </>
            )}
        </div>
    );
};

export default Home;
