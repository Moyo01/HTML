import { createElement } from 'lwc';
import SearchProducts from 'c/searchProducts';
import searchProducts from '@salesforce/apex/SearchProductService.searchProducts';

// Mock the Apex method
jest.mock('@salesforce/apex/SearchProductService.searchProducts', () => ({
    default: jest.fn()
}), { virtual: true });

describe('c-search-products', () => {
    let element;

    beforeEach(() => {
        // Create the component instance
        element = createElement('c-search-products', {
            is: SearchProducts
        });
        document.body.appendChild(element);
    });

    afterEach(() => {
        // Cleanup the DOM after each test
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        jest.clearAllMocks();
    });

    it('should render modal and cancel it', () => {
        // Click the button to open the modal
        const button = element.shadowRoot.querySelector('lightning-button');
        button.click();

        // Verify the modal is rendered
        return Promise.resolve().then(() => {
            const modalSection = element.shadowRoot.querySelector('section.slds-modal');
            expect(modalSection).not.toBeNull();

            // Click the close button
            const closeButton = element.shadowRoot.querySelector('button.slds-button_icon');
            closeButton.click();

            // Verify the modal is removed
            return Promise.resolve().then(() => {
                const modalSectionAfterClose = element.shadowRoot.querySelector('section.slds-modal');
                expect(modalSectionAfterClose).toBeNull();
            });
        });
    });

    it('should render modal and close it with escape key', () => {
        // Click the button to open the modal
        const button = element.shadowRoot.querySelector('lightning-button');
        button.click();

        // Verify the modal is rendered
        return Promise.resolve().then(() => {
            const modalSection = element.shadowRoot.querySelector('section.slds-modal');
            expect(modalSection).not.toBeNull();

            // Dispatch a keydown event for Escape key
            const escapeKeyDown = new KeyboardEvent('keydown', {
                keyCode: 27
            });
            document.dispatchEvent(escapeKeyDown);

            // Verify the modal is removed
            return Promise.resolve().then(() => {
                const modalSectionAfterClose = element.shadowRoot.querySelector('section.slds-modal');
                expect(modalSectionAfterClose).toBeNull();
            });
        });
    });

    it('should render modal and close it with click outside', () => {
        // Click the button to open the modal
        const button = element.shadowRoot.querySelector('lightning-button');
        button.click();

        // Verify the modal is rendered
        return Promise.resolve().then(() => {
            const modalSection = element.shadowRoot.querySelector('section.slds-modal');
            expect(modalSection).not.toBeNull();

            // Dispatch a click event on the body
            const clickEvent = new CustomEvent('click');
            document.dispatchEvent(clickEvent);

            // Verify the modal is removed
            return Promise.resolve().then(() => {
                const modalSectionAfterClose = element.shadowRoot.querySelector('section.slds-modal');
                expect(modalSectionAfterClose).toBeNull();
            });
        });
    });

    it('should render data table', () => {
        // Click the button to open the modal
        const button = element.shadowRoot.querySelector('lightning-button');
        button.click();

        // Verify the modal is rendered
        return Promise.resolve().then(() => {
            const modalSection = element.shadowRoot.querySelector('section.slds-modal');
            expect(modalSection).not.toBeNull();

            // Verify the data table is rendered within the modal
            const dataTable = element.shadowRoot.querySelector('lightning-datatable');
            expect(dataTable).not.toBeNull();
        });
    });

    it('should fetch and display products on search', () => {
        // Click the button to open the modal
        const button = element.shadowRoot.querySelector('lightning-button');
        button.click();

        // Verify the modal is rendered
        return Promise.resolve().then(() => {
            const modalSection = element.shadowRoot.querySelector('section.slds-modal');
            expect(modalSection).not.toBeNull();

            // Simulate a change event on the search input
            const input = element.shadowRoot.querySelector('lightning-input');
            input.value = 'test';
            input.dispatchEvent(new CustomEvent('change'));

            // Verify the fetchProducts function is called
            return Promise.resolve().then(() => {
                expect(searchProducts).toHaveBeenCalled();

                // Mock the response and verify the data table displays the fetched products
                searchProducts.mockResolvedValue([{ Id: '001', Name: 'Product 1', ProductCode: 'P001', Family: 'Electronics' }]);
                return Promise.resolve().then(() => {
                    const dataTable = element.shadowRoot.querySelector('lightning-datatable');
                    expect(dataTable.data).toHaveLength(1);
                });
            });
        });
    });
});