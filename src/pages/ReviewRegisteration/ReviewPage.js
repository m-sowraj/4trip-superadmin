import React, { useEffect, useState } from 'react';
import AgentsTableReview from './Agents';
import PartnersTableReview from './Partners';
import { toast, ToastContainer } from 'react-toastify';
import axios from '../../utils/axios';

function ReviewPage() {
    const [active, setActive] = useState("agents");
    const [agents, setAgents] = useState([]);
    const [partners, setPartners] = useState([]);
    const [allData, setAllData] = useState([]);

    const fetchData = async () => {
        try {
            const response = await axios.get('/superadmin/reviewdata');
            setAllData(response.data.data);
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (allData.length > 0) {
            const agents = allData.filter(item => item.reg_type === "agent");
            const partners = allData.filter(item => item.reg_type === "partner");
            setAgents(agents);
            setPartners(partners);
        }
    }, [allData]);

    return (
        <div className="h-[90%] flex flex-col">
            <div className="flex gap-5">
                <div 
                    className={`px-4 py-1 bg-white cursor-pointer flex items-center gap-2 rounded-full ${active === "agents" ? "border-2" : "border-white border-2"}`} 
                    onClick={() => setActive("agents")}
                >
                    <span className="w-5 h-5 bg-blue-500 rounded-full"></span>Agents
                </div>
                <div 
                    className={`px-4 py-1 bg-white cursor-pointer flex items-center gap-2 rounded-full ${active !== "agents" ? "border-2" : "border-white border-2"}`} 
                    onClick={() => setActive("partners")}
                >
                    <span className="w-5 h-5 bg-[var(--green)] rounded-full"></span>Partners
                </div>
            </div>
            <ToastContainer />
            <div className='mt-6 flex-1'>
                {active === "agents" ? <AgentsTableReview agents={agents} onUpdate={fetchData} /> : null}
                {active === "partners" ? <PartnersTableReview Partners={partners} onUpdate={fetchData} /> : null}
            </div>
        </div>
    );
}

export default ReviewPage
