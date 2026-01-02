document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('passwordForm');
    const passwordInput = document.getElementById('password');
    const lengthSlider = document.getElementById('length');
    const lengthValue = document.getElementById('lengthValue');
    const copyBtn = document.getElementById('copyBtn');

    console.log('Elements found:', {form, passwordInput, lengthSlider}); // Debug

    lengthSlider.addEventListener('input', (e) => {
        lengthValue.textContent = e.target.value;
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const data = {
            length: parseInt(lengthSlider.value),
            include_upper: document.getElementById('includeUpper').checked,
            include_lower: document.getElementById('includeLower').checked,
            include_digits: document.getElementById('includeDigits').checked,
            include_special: document.getElementById('includeSpecial').checked
        };

        console.log('Sending:', data); // Debug

        try {
            const response = await fetch('/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            
            console.log('Status:', response.status); // Debug
            
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const result = await response.json();
            console.log('Result:', result); // Debug
            
            passwordInput.value = result.password;
            
        } catch (error) {
            console.error('Error:', error);
            passwordInput.value = `Error: ${error.message}`;
        }
    });

    copyBtn.addEventListener('click', () => {
        passwordInput.select();
        document.execCommand('copy');
        copyBtn.textContent = '✅';
        setTimeout(() => copyBtn.textContent = '📋', 2000);
    });
});
