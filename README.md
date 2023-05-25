# 📐 DiGram
## Projekt
Programy służące do kreowania schematów blokowych algorytmów to narzędzia
wykorzystywane w dziedzinie informatyki i programowania. Ich celem jest umożliwienie
łatwego i intuicyjnego przedstawienia kroków algorytmu w postaci diagramu blokowego.

Schemat blokowy jest używany w celu przedstawienia algorytmu w sposób
zrozumiały dla ludzi, ułatwiający wizualizację kolejności działań oraz umożliwiający
łatwiejsze debugowanie kodu. Programy do rysowania schematów blokowych algorytmów
są używane przez programistów, studentów informatyki, naukowców i inżynierów, którzy
potrzebują sposobu na przedstawienie procesów algorytmicznych w przystępny sposób.

## Funkcjonalności
- Tworzenie diagramów blokowych:
  - Program powinien umożliwiać tworzenie diagramów blokowych, w których
użytkownik może dodawać bloki symbolizujące poszczególne kroki
algorytmu.
- Użytkownik powinien mieć możliwość połączenia bloków ze sobą, aby
utworzyć logiczną sekwencję kroków algorytmu.
  - Program powinien umożliwiać dodawanie komentarzy do diagramów
blokowych, aby umożliwić użytkownikowi opisanie algorytmu.
- Generowanie kodu w języku C:
  - Program powinien umożliwiać generowanie kodu źródłowego w języku C na
podstawie stworzonego diagramu blokowego.
  - Generowany kod powinien być zgodny z obowiązującą składnią języka C.
  - Użytkownik powinien mieć możliwość wyboru nazwy pliku wyjściowego i
lokalizacji zapisu.
- Program zakłada, że utworzony przez użytkownika schemat blokowy jest
poprawny i nie zawiera błędów które mogą prowadzić do błędnego działania
wygenerowanego kodu programu
- Import i eksport:
  - Program powinien umożliwiać importowanie diagramów blokowych z pliku.
  
  - Użytkownik powinien mieć możliwość eksportowania diagramów
blokowych do różnych formatów plików, takich jak PNG, JPG.
- Obsługa różnych bloków:
  - Program powinien umożliwiać użytkownikowi wybór z różnych bloków,
takich jak "wejście danych", "przetwarzanie", "prosty warunek", "wyjście
danych", "funkcja", aby umożliwić stworzenie diagramów blokowych dla
różnych rodzajów algorytmów.
- Walidacja diagramów blokowych:
  - Walidacja powinna obejmować sprawdzanie, czy diagram blokowy jest
kompletny.

## Wygenerowany Kod
```C
/**
 *  Kod wygenerowano przy użyciu narzędzia DiGram
 *  (c) 2023 Marcin Ślusarczyk, Maciej Bandura
 */

#include <stdlib.h>
#include <stdio.h>
#include <stdbool.h>

int main();

int main()
{
	int x = 0;

	printf("Wprowadz liczbe: ");
scanf("%d", &x);

	if (x%2 != 0)
		goto _label_4;

	if (x%2 == 0)
		goto _label_3;

_label_4: ;
	printf("Liczba %d nie jest parzysta\n", x);

	return 0;

_label_3: ;
	printf("Liczba %d jest parzysta\n", x);

	if (x<5 == true)
		goto _label_7;

	if (x<5 == false)
		goto _label_8;

_label_7: ;
	printf("Liczba %d jest parzysta i mniejsza od 5\n", x);

	return 0;

_label_8: ;
	printf("Liczba %d jest parzysta i wieksza od 5\n", x);

	return 0;
}
```

## Galeria
![Don't ask me why this one is jpg](https://raw.githubusercontent.com/quakcin/DiGram/main/__gallery/s1.jpg)
![](https://raw.githubusercontent.com/quakcin/DiGram/main/__gallery/s2.png)
![](https://raw.githubusercontent.com/quakcin/DiGram/main/__gallery/s3.png)
