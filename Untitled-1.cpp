#include <iostream>
using namespace std;

// --- UTILITY FUNCTIONS ---
void printArray(int inp_arr[], int n) {
    for (int i = 0; i < n; i++) cout << inp_arr[i] << " ";
    cout << "\n";
}

int getMax(int inp_arr[], int n) {
    int mx = inp_arr[0];
    for (int i = 1; i < n; i++)
        if (inp_arr[i] > mx) mx = inp_arr[i];
    return mx;
}

// 1. BUBBLE SORT
void bubbleSort(int inp_arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        bool swapped = false;
        for (int j = 0; j < n - i - 1; j++) {
            if (inp_arr[j] > inp_arr[j + 1]) {
                swap(inp_arr[j], inp_arr[j + 1]);
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}

// 2. INSERTION SORT
void insertionSort(int inp_arr[], int n) {
    for (int i = 1; i < n; i++) {
        int key = inp_arr[i];
        int j = i - 1;
        while (j >= 0 && inp_arr[j] > key) {
            inp_arr[j + 1] = inp_arr[j];
            j = j - 1;
        }
        inp_arr[j + 1] = key;
    }
}

// 3. SELECTION SORT
void selectionSort(int inp_arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int min_idx = i;
        for (int j = i + 1; j < n; j++) {
            if (inp_arr[j] < inp_arr[min_idx])
                min_idx = j;
        }
        swap(inp_arr[min_idx], inp_arr[i]);
    }
}

// 4. MERGE SORT
void merge(int inp_arr[], int l, int m, int r) {
    int n1 = m - l + 1, n2 = r - m;
    int L[n1], R[n2];
    for (int i = 0; i < n1; i++) L[i] = inp_arr[l + i];
    for (int j = 0; j < n2; j++) R[j] = inp_arr[m + 1 + j];
    
    int i = 0, j = 0, k = l;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) inp_arr[k++] = L[i++];
        else inp_arr[k++] = R[j++];
    }
    while (i < n1) inp_arr[k++] = L[i++];
    while (j < n2) inp_arr[k++] = R[j++];
}

void mergeSort(int inp_arr[], int l, int r) {
    if (l >= r) return;
    int m = l + (r - l) / 2;
    mergeSort(inp_arr, l, m);
    mergeSort(inp_arr, m + 1, r);
    merge(inp_arr, l, m, r);
}

// 5. QUICK SORT
int partition(int inp_arr[], int low, int high) {
    int pivot = inp_arr[high];
    int i = (low - 1);
    for (int j = low; j <= high - 1; j++) {
        if (inp_arr[j] < pivot) {
            i++;
            swap(inp_arr[i], inp_arr[j]);
        }
    }
    swap(inp_arr[i + 1], inp_arr[high]);
    return (i + 1);
}

void quickSort(int inp_arr[], int low, int high) {
    if (low < high) {
        int pi = partition(inp_arr, low, high);
        quickSort(inp_arr, low, pi - 1);
        quickSort(inp_arr, pi + 1, high);
    }
}

// 6. RADIX SORT
void countSort(int inp_arr[], int n, int exp) {
    int output[n], i, count[10] = { 0 };
    for (i = 0; i < n; i++) count[(inp_arr[i] / exp) % 10]++;
    for (i = 1; i < 10; i++) count[i] += count[i - 1];
    for (i = n - 1; i >= 0; i--) {
        output[count[(inp_arr[i] / exp) % 10] - 1] = inp_arr[i];
        count[(inp_arr[i] / exp) % 10]--;
    }
    for (i = 0; i < n; i++) inp_arr[i] = output[i];
}

void radixSort(int inp_arr[], int n) {
    int m = getMax(inp_arr, n);
    for (int exp = 1; m / exp > 0; exp *= 10)
        countSort(inp_arr, n, exp);
}

// --- MAIN FUNCTION ---
int main() {
    int inp_arr[] = {170, 45, 75, 90, 802, 24, 2, 66};
    int n = sizeof(inp_arr) / sizeof(inp_arr[0]);

    cout << "Original array: \n";
    printArray(inp_arr, n);

    cout << "\nChoose sorting algorithm:\n";
    cout << "1. Bubble Sort\n2. Insertion Sort\n3. Selection Sort\n";
    cout << "4. Merge Sort\n5. Quick Sort\n6. Radix Sort\n";
    
    int choice = 5; // Change this value to test different algorithms
    cout << "Selected choice: " << choice << "\n\n";

    switch(choice) {
        case 1: bubbleSort(inp_arr, n); break;
        case 2: insertionSort(inp_arr, n); break;
        case 3: selectionSort(inp_arr, n); break;
        case 4: mergeSort(inp_arr, 0, n - 1); break;
        case 5: quickSort(inp_arr, 0, n - 1); break;
        case 6: radixSort(inp_arr, n); break;
        default: cout << "Invalid choice.\n"; return 0;
    }

    cout << "Sorted array: \n";
    printArray(inp_arr, n);

    return 0;
}