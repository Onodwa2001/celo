import { Disclosure } from "@headlessui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect, useState } from "react";
import { useConnect } from "wagmi";
import { injected } from "wagmi/connectors";

export default function Header() {
    const [hideConnectBtn, setHideConnectBtn] = useState(false);
    const { connect } = useConnect();

    useEffect(() => {
        if (window.ethereum && window.ethereum.isMiniPay) {
            setHideConnectBtn(true);
            connect({ connector: injected({ target: "metaMask" }) });
        }
    }, []);

    return (
        <Disclosure as="nav" style={{
            backgroundColor: '#96d8e2'
        }}>
                <>
                    <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                        <div className="relative flex h-16 justify-between">
                            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                                {!hideConnectBtn && (
                                    <ConnectButton
                                        showBalance={{
                                            smallScreen: true,
                                            largeScreen: false,
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </>
        </Disclosure>
    );
}
