import "./homeTopBar.scss"
import { Menubar } from 'primereact/menubar';
import { InputText } from 'primereact/inputtext';
import { Fieldset } from 'primereact/fieldset';
const HomeTopBar = () => {
    const items = [
        {
            label: 'New',
            icon: 'pi pi-fw pi-bell',
            items: [
                {
                    label: 'New',
                    icon: 'pi pi-fw pi-plus',
                    items: [
                        {
                            label: 'Popular',
                            icon: 'pi pi-fw pi-bookmark'
                        },
                        {
                            label: 'All',
                            icon: 'pi pi-fw pi-external-link'
                        },

                    ]
                },
                {
                    separator: true
                },
                {
                    label: 'For you',
                    icon: 'pi pi-fw pi-star'
                },

                {
                    label: 'Now',
                    icon: 'pi pi-fw pi-caret-up'
                }
            ]
        },
        {
            label: 'Food',
            icon: 'pi pi-fw pi-shopping-cart',
            items: [
                {
                    label: 'ALL',
                    icon: 'pi pi-fw pi-align-left'
                },
                {
                    label: 'Drink',
                    icon: 'pi pi-fw pi-align-right'
                },
                {
                    label: 'Fast Food',
                    icon: 'pi pi-fw pi-align-center'
                },


            ]
        },
        {
            label: 'Fashion',
            icon: 'pi pi-fw pi-user',
            items: [
                {
                    label: 'New',
                    icon: 'pi pi-fw pi-bolt',

                },
                {
                    label: 'Man',
                    icon: 'pi pi-fw pi-user-minus',

                },
                {
                    label: 'Kid',
                    icon: 'pi pi-fw pi-users',
                },
                {
                    label: 'Woman',
                    icon: 'pi pi-fw pi-users',
                }
            ]
        },
        {
            label: 'Events',
            icon: 'pi pi-fw pi-calendar',
            command: () => window.location.href = '/product'

        },
    ];

    const start = <img alt="logo" src="https://cdn-icons-png.flaticon.com/512/3177/3177440.png" height="40" className="mr-2"></img>;
    const end = <InputText placeholder="Search" type="text" className="w-full" />;

    return (
        <div className="hometopbar">
            <Menubar model={items} start={start} end={end} />
            <div className="header">
                <Fieldset legend="For You" className="show">
                    <p className="m-0">
                    Discover unparalleled style and quality at our ecommerce web store, where every click brings you closer to a seamless shopping 
                    experience filled with curated products that elevate your lifestyle.
                    </p>
                </Fieldset>
            </div>

        </div>
    )
}
export default HomeTopBar